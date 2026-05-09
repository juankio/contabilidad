import mongoose from 'mongoose'
import { GastoModel } from '../models/gasto'
import { IngresoModel } from '../models/ingreso'
import { getResendClient, getResendFrom } from '../utils/resend'
import { upsertProfileCategory } from '../utils/profile-category-store'
import { getAvailableBalance } from '../utils/balance'
import { createError } from 'h3'
import type { GastoCreateDto } from '../schemas/gasto.schema'
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

export async function createGastoService(
  profileId: string,
  user: UserDocument,
  data: GastoCreateDto
) {
  const date = data.date ? new Date(data.date) : new Date()
  if (Number.isNaN(date.getTime())) {
    throw new Error('La fecha proporcionada no es válida')
  }

  // 1. Reglas de negocio: Ya no bloqueamos por fondos insuficientes, permitimos saldo negativo.
  // const balanceActual = await getAvailableBalance(profileId)

  // 2. Guardar en BD
  const doc = await GastoModel.create({
    profileId,
    description: data.description.trim(),
    category: data.category.trim(),
    amount: data.amount,
    date
  })

  if (!doc) throw new Error('Failed to create gasto')

  // 3. Tareas asíncronas
  const emailNotificationSent = true

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
      const expenseRatio = ingresos > 0 ? Math.min(100, Math.round((gastos / ingresos) * 100)) : (gastos > 0 ? 100 : 0)
      const savingRatio = ingresos > 0 ? Math.max(0, Math.min(100, Math.round((saldo / ingresos) * 100))) : 0
      const saldoColor = saldo >= 0 ? '#0f766e' : '#b91c1c'
      const balanceLabel = saldo >= 0 ? 'Saldo disponible' : 'Saldo negativo'

      const resend = getResendClient()
      const from = getResendFrom()
      const subject = 'Se registro un nuevo gasto en tus cuentas'

      const html = `
        <!doctype html>
        <html lang="es">
          <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
            <div style="max-width:620px;margin:20px auto;background:#fff;border-radius:18px;padding:24px;">
              <h1 style="color:#0f172a;">Nuevo gasto registrado</h1>
              <p>Descripcion: ${escapeHtml(doc.description)}</p>
              <p>Monto: ${formattedAmount}</p>
              <p>Fecha: ${formattedDate}</p>
              <hr/>
              <p>${balanceLabel}: <strong style="color:${saldoColor}">${formattedSaldo}</strong></p>
              <p>Uso de ingresos: ${expenseRatio}% | Ahorro: ${savingRatio}%</p>
            </div>
          </body>
        </html>
      `

      const text = `Gasto registrado: ${doc.description} por ${formattedAmount}`

      const result = await resend.emails.send({ from, to: user.email, subject, html, text })
      if (result.error) console.error('[gastos] Resend error:', result.error.message)
    } catch (err) {
      console.error('[gastos] Failed to send email:', err)
    }
  }

  sendEmailTask()

  // Esperar obligatoriamente a que la categoría se guarde para no desincronizar el Frontend
  try {
    await upsertProfileCategory(user._id, profileId, 'expense', doc.category)
  } catch (e) {
    console.error('[gastos] Failed to sync category:', e)
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
