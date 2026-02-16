import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { IngresoModel } from '../../models/ingreso'
import { GastoModel } from '../../models/gasto'
import mongoose from 'mongoose'
import { getResendClient, getResendFrom } from '../../utils/resend'
import { upsertProfileCategory } from '../../utils/profile-category-store'

const ingresoSchema = z.object({
  description: z.string().trim().min(1),
  category: z.string().trim().min(1).default('Otros'),
  amount: z.preprocess(value => Number(value), z.number().positive()),
  date: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = ingresoSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues.map(issue => issue.message).join(', ')
    })
  }

  const date = parsed.data.date ? new Date(parsed.data.date) : new Date()
  if (Number.isNaN(date.getTime())) {
    throw createError({
      statusCode: 400,
      statusMessage: 'date must be a valid ISO string'
    })
  }

  await connectMongoose()
  const { profileId, user } = await requireActiveProfile(event)
  const doc = await IngresoModel.create({
    profileId,
    description: parsed.data.description.trim(),
    category: parsed.data.category.trim(),
    amount: parsed.data.amount,
    date
  })

  let emailNotificationSent = true

  try {
    const profileObjectId = new mongoose.Types.ObjectId(profileId)
    const now = new Date()
    const start = getMonthStartUTC(now)
    const end = getNextMonthStartUTC(now)

    const [ingresosAgg, gastosAgg] = await Promise.all([
      IngresoModel.aggregate([
        { $match: { profileId: profileObjectId, date: { $gte: start, $lt: end } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      GastoModel.aggregate([
        { $match: { profileId: profileObjectId, date: { $gte: start, $lt: end } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ])

    const ingresos = ingresosAgg[0]?.total ?? 0
    const gastos = gastosAgg[0]?.total ?? 0
    const saldo = ingresos - gastos

    const month = new Intl.DateTimeFormat('es-MX', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(now)

    const formattedAmount = formatCurrency(doc.amount)
    const formattedIngresos = formatCurrency(ingresos)
    const formattedGastos = formatCurrency(gastos)
    const formattedSaldo = formatCurrency(saldo)
    const formattedDate = doc.date.toISOString().split('T')[0]

    const resend = getResendClient()
    const from = getResendFrom()
    const subject = 'Se registro un nuevo ingreso en tus cuentas'
    const html = `
      <div style="margin:0;padding:24px;background:#f3f4f6;font-family:Arial,sans-serif;color:#0f172a;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="padding:22px 24px;background:linear-gradient(135deg,#0f766e,#0ea5e9);color:#f8fafc;">
              <div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.8;">Mi Contabilidad</div>
              <h1 style="margin:10px 0 0;font-size:24px;line-height:1.2;">Nuevo ingreso registrado</h1>
              <p style="margin:8px 0 0;font-size:14px;opacity:.9;">Se agrego un ingreso y este es el estado de tu mes en ${month}.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 24px 8px;">
              <div style="font-size:13px;color:#334155;margin-bottom:8px;"><strong>Detalle del movimiento</strong></div>
              <div style="font-size:14px;line-height:1.7;color:#0f172a;">
                <div><strong>Descripcion:</strong> ${escapeHtml(doc.description)}</div>
                <div><strong>Categoria:</strong> ${escapeHtml(doc.category)}</div>
                <div><strong>Monto:</strong> ${formattedAmount}</div>
                <div><strong>Fecha:</strong> ${formattedDate}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 24px 20px;">
              <div style="font-size:13px;color:#334155;margin-bottom:8px;"><strong>Resumen del mes</strong></div>
              <div style="font-size:13px;color:#475569;line-height:1.8;">
                <div>Ingresos: <strong style="color:#0f172a;">${formattedIngresos}</strong></div>
                <div>Gastos: <strong style="color:#0f172a;">${formattedGastos}</strong></div>
                <div>Saldo: <strong style="color:${saldo >= 0 ? '#0f766e' : '#b91c1c'};">${formattedSaldo}</strong></div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    `
    const text = [
      'Se registro un nuevo ingreso en tus cuentas.',
      `Descripcion: ${doc.description}`,
      `Categoria: ${doc.category}`,
      `Monto: ${formattedAmount}`,
      `Fecha: ${formattedDate}`,
      `Ingresos del mes (${month}): ${formattedIngresos}`,
      `Gastos del mes (${month}): ${formattedGastos}`,
      `Saldo del mes (${month}): ${formattedSaldo}`
    ].join('\n')

    const result = await resend.emails.send({
      from,
      to: user.email,
      subject,
      html,
      text
    })

    if (result.error) {
      emailNotificationSent = false
      console.error('[ingresos] Failed to send email notification:', result.error.message || 'Resend error')
    }
  } catch (error) {
    emailNotificationSent = false
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[ingresos] Failed to send email notification:', message)
  }

  try {
    await upsertProfileCategory(user._id, profileId, 'income', doc.category)
  } catch {
    // Keep movement creation successful even if category sync fails.
  }

  return {
    _id: doc._id.toString(),
    description: doc.description,
    category: doc.category,
    amount: doc.amount,
    date: doc.date.toISOString(),
    emailNotificationSent
  }
})

function getMonthStartUTC(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
}

function getNextMonthStartUTC(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1))
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}
