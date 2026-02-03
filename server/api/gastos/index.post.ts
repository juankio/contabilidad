import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { GastoModel } from '../../models/gasto'
import { IngresoModel } from '../../models/ingreso'
import mongoose from 'mongoose'
import { getResendClient, getResendFrom } from '../../utils/resend'

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

    const formattedAmount = `$${doc.amount.toFixed(2)}`
    const formattedSaldo = `$${saldo.toFixed(2)}`
    const formattedDate = doc.date.toISOString().split('T')[0]

    const resend = getResendClient()
    const from = getResendFrom()
    const subject = 'Se registro un nuevo gasto en tus cuentas'
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Se acaba de agregar un nuevo gasto en tus cuentas. ¿Quieres ver tus fondos?</p>
        <p><strong>Descripcion:</strong> ${escapeHtml(doc.description)}</p>
        <p><strong>Categoria:</strong> ${escapeHtml(doc.category)}</p>
        <p><strong>Monto:</strong> ${formattedAmount}</p>
        <p><strong>Fecha:</strong> ${formattedDate}</p>
        <p><strong>Saldo del mes (${month}):</strong> ${formattedSaldo}</p>
      </div>
    `
    const text = [
      'Se acaba de agregar un nuevo gasto en tus cuentas. ¿Quieres ver tus fondos?',
      `Descripcion: ${doc.description}`,
      `Categoria: ${doc.category}`,
      `Monto: ${formattedAmount}`,
      `Fecha: ${formattedDate}`,
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
      throw createError({
        statusCode: 502,
        statusMessage: result.error.message || 'Resend error'
      })
    }
  } catch (error) {
    await GastoModel.deleteOne({ _id: doc._id })
    throw error
  }

  return {
    _id: doc._id.toString(),
    description: doc.description,
    category: doc.category,
    amount: doc.amount,
    date: doc.date.toISOString()
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
