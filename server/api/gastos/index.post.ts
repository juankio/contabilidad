import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { GastoModel } from '../../models/gasto'
import { IngresoModel } from '../../models/ingreso'
import mongoose from 'mongoose'
import { getResendClient, getResendFrom } from '../../utils/resend'
import { upsertProfileCategory } from '../../utils/profile-category-store'

const gastoSchema = z.object({
  description: z.string().trim().min(1),
  category: z.string().trim().min(1).default('Sin categoria'),
  amount: z.preprocess(value => Number(value), z.number().positive()),
  date: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = gastoSchema.safeParse(body)

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
  const doc = await GastoModel.create({
    profileId,
    description: parsed.data.description.trim(),
    category: parsed.data.category.trim(),
    amount: parsed.data.amount,
    date
  })
  if (!doc) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create gasto'
    })
  }

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
    const expenseRatio = ingresos > 0 ? Math.min(100, Math.round((gastos / ingresos) * 100)) : (gastos > 0 ? 100 : 0)
    const savingRatio = ingresos > 0 ? Math.max(0, Math.min(100, Math.round((saldo / ingresos) * 100))) : 0
    const saldoColor = saldo >= 0 ? '#0f766e' : '#b91c1c'
    const balanceLabel = saldo >= 0 ? 'Saldo disponible' : 'Saldo negativo'
    const escapedDescription = escapeHtml(doc.description)
    const escapedCategory = escapeHtml(doc.category)

    const resend = getResendClient()
    const from = getResendFrom()
    const subject = 'Se registro un nuevo gasto en tus cuentas'
    const html = `
      <div style="margin:0;padding:24px;background:#f3f4f6;font-family:Arial,sans-serif;color:#0f172a;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="padding:22px 24px;background:linear-gradient(135deg,#111827,#1e293b);color:#f8fafc;">
              <div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.8;">Mi Contabilidad</div>
              <h1 style="margin:10px 0 0;font-size:24px;line-height:1.2;">Nuevo gasto registrado</h1>
              <p style="margin:8px 0 0;font-size:14px;opacity:.9;">Se agrego un movimiento y este es el estado de tu mes en ${month}.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 24px 6px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 10px 14px 0;" width="50%">
                    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:14px;">
                      <div style="font-size:12px;color:#475569;">Monto del gasto</div>
                      <div style="margin-top:6px;font-size:24px;font-weight:700;color:#0f172a;">${formattedAmount}</div>
                    </div>
                  </td>
                  <td style="padding:0 0 14px 10px;" width="50%">
                    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:14px;">
                      <div style="font-size:12px;color:#475569;">${balanceLabel}</div>
                      <div style="margin-top:6px;font-size:24px;font-weight:700;color:${saldoColor};">${formattedSaldo}</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:4px 24px 6px;">
              <div style="font-size:13px;color:#334155;margin-bottom:8px;"><strong>Detalle del movimiento</strong></div>
              <div style="font-size:14px;line-height:1.7;color:#0f172a;">
                <div><strong>Descripcion:</strong> ${escapedDescription}</div>
                <div><strong>Categoria:</strong> ${escapedCategory}</div>
                <div><strong>Fecha:</strong> ${formattedDate}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 24px;">
              <div style="font-size:13px;color:#334155;margin-bottom:8px;"><strong>Metricas del mes</strong></div>
              <div style="font-size:13px;color:#475569;margin-bottom:4px;">Ingresos: <strong style="color:#0f172a;">${formattedIngresos}</strong></div>
              <div style="font-size:13px;color:#475569;margin-bottom:4px;">Gastos: <strong style="color:#0f172a;">${formattedGastos}</strong></div>
              <div style="margin-top:10px;font-size:12px;color:#475569;">Uso de ingresos en gastos (${expenseRatio}%)</div>
              <div style="margin-top:6px;background:#e2e8f0;border-radius:999px;height:10px;overflow:hidden;">
                <div style="height:10px;width:${expenseRatio}%;background:linear-gradient(90deg,#fb7185,#ef4444);"></div>
              </div>
              <div style="margin-top:10px;font-size:12px;color:#475569;">Ahorro del mes (${savingRatio}%)</div>
              <div style="margin-top:6px;background:#e2e8f0;border-radius:999px;height:10px;overflow:hidden;">
                <div style="height:10px;width:${savingRatio}%;background:linear-gradient(90deg,#14b8a6,#0ea5e9);"></div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 24px 24px;font-size:12px;color:#64748b;">
              Recibiste este correo porque se registro un movimiento en tu cuenta.
            </td>
          </tr>
        </table>
      </div>
    `
    const text = [
      'Se registro un nuevo gasto en tus cuentas.',
      `Descripcion: ${doc.description}`,
      `Categoria: ${doc.category}`,
      `Monto: ${formattedAmount}`,
      `Fecha: ${formattedDate}`,
      `Ingresos del mes (${month}): ${formattedIngresos}`,
      `Gastos del mes (${month}): ${formattedGastos}`,
      `Saldo del mes (${month}): ${formattedSaldo}`,
      `Uso de ingresos en gastos: ${expenseRatio}%`,
      `Ahorro del mes: ${savingRatio}%`
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
      console.error('[gastos] Failed to send email notification:', result.error.message || 'Resend error')
    }
  } catch (error) {
    emailNotificationSent = false
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[gastos] Failed to send email notification:', message)
  }

  try {
    await upsertProfileCategory(user._id, profileId, 'expense', doc.category)
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
