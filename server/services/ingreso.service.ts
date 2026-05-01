import mongoose from 'mongoose'
import { IngresoModel } from '../models/ingreso'
import { GastoModel } from '../models/gasto'
import { getResendClient, getResendFrom } from '../utils/resend'
import { upsertProfileCategory } from '../utils/profile-category-store'
import type { IngresoCreateDto } from '../schemas/ingreso.schema'
import type { UserDocument } from '../models/user'

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
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    currencyDisplay: 'code',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

export async function createIngresoService(
  profileId: string, 
  user: UserDocument, 
  data: IngresoCreateDto
) {
  const date = data.date ? new Date(data.date) : new Date()
  if (Number.isNaN(date.getTime())) {
    throw new Error('La fecha proporcionada no es válida')
  }

  // 1. Guardar en BD
  const doc = await IngresoModel.create({
    profileId,
    description: data.description.trim(),
    category: data.category.trim(),
    amount: data.amount,
    date
  })

  // 2. Tareas en segundo plano (Fire and forget para no bloquear la request)
  let emailNotificationSent = true

  const sendEmailTask = async () => {
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

      const month = new Intl.DateTimeFormat('es-CO', {
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
        <!doctype html>
        <html lang="es">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              @media only screen and (max-width: 620px) {
                .email-shell { padding: 0 !important; }
                .container { border-radius: 0 !important; }
                .px { padding-left: 16px !important; padding-right: 16px !important; }
              }
            </style>
          </head>
          <body style="margin:0;padding:0;background:#f3f4f6;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;">
              <tr>
                <td class="email-shell" style="padding:24px 12px;font-family:Arial,sans-serif;color:#0f172a;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="container" style="width:100%;max-width:620px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">
                    <tr>
                      <td class="px" style="padding:22px 24px;background:linear-gradient(135deg,#0f766e,#0ea5e9);color:#f8fafc;">
                        <h1 style="margin:10px 0 0;font-size:24px;">Nuevo ingreso registrado</h1>
                      </td>
                    </tr>
                    <tr>
                      <td class="px" style="padding:18px 24px 8px;">
                        <div><strong>Descripcion:</strong> ${escapeHtml(doc.description)}</div>
                        <div><strong>Monto:</strong> ${formattedAmount}</div>
                      </td>
                    </tr>
                    <tr>
                      <td class="px" style="padding:10px 24px 20px;">
                        <div>Ingresos: <strong>${formattedIngresos}</strong></div>
                        <div>Gastos: <strong>${formattedGastos}</strong></div>
                        <div>Saldo: <strong>${formattedSaldo}</strong></div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `
      
      const text = `Se registro un nuevo ingreso: ${doc.description} por ${formattedAmount}`

      const result = await resend.emails.send({ from, to: user.email, subject, html, text })
      if (result.error) console.error('[ingresos] Resend error:', result.error.message)
    } catch (err) {
      console.error('[ingresos] Failed to send email:', err)
    }
  }

  // Lanzar en background
  sendEmailTask()

  // Esperar obligatoriamente a que la categoría se guarde para no desincronizar el Frontend
  try {
    await upsertProfileCategory(user._id, profileId, 'income', doc.category)
  } catch (e) {
    console.error('[ingresos] Failed to sync category:', e)
  }

  return {
    _id: doc._id.toString(),
    description: doc.description,
    category: doc.category,
    amount: doc.amount,
    date: doc.date.toISOString(),
    emailNotificationSent // always true initially, actual sending is async
  }
}
