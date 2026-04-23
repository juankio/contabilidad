import { defineApiHandler } from '../../utils/handler'
import { createError, readBody } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { PrestamoModel } from '../../models/prestamo'
import { toIsoDate } from '../../utils/date'
import { getAvailableBalance } from '../../utils/balance'

const prestamoSchema = z.object({
  borrower: z.string().trim().min(1).max(60),
  description: z.string().trim().max(120).optional(),
  amount: z.preprocess(value => Number(value), z.number().positive()),
  date: z.string().optional(),
  paymentPlan: z.enum(['single', 'installments']).default('single'),
  installmentsCount: z.preprocess((value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined
    }
    return Number(value)
  }, z.number().int().min(2).max(240).optional()),
  collectionDate: z.string().optional(),
  note: z.string().trim().max(160).optional()
}).superRefine((value, context) => {
  if (value.paymentPlan === 'installments' && !value.installmentsCount) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['installmentsCount'],
      message: 'Debes indicar cuantas cuotas tendra el prestamo.'
    })
  }
})

export default defineApiHandler(async (event) => {
  const body = await readBody(event)
  const parsed = prestamoSchema.safeParse(body)

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

  const collectionDate = parsed.data.collectionDate ? new Date(parsed.data.collectionDate) : null
  if (collectionDate && Number.isNaN(collectionDate.getTime())) {
    throw createError({
      statusCode: 400,
      statusMessage: 'collectionDate must be a valid ISO string'
    })
  }

  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)

  const balanceActual = await getAvailableBalance(profileId)
  if (parsed.data.amount > balanceActual) {
    throw createError({
      statusCode: 400,
      statusMessage: `Fondos insuficientes. No puedes prestar $${parsed.data.amount} porque solo tienes $${balanceActual} disponibles.`
    })
  }

  const paymentPlan = parsed.data.paymentPlan
  const installmentsCount = paymentPlan === 'installments'
    ? (parsed.data.installmentsCount ?? null)
    : null
  const doc = await PrestamoModel.create({
    profileId,
    borrower: parsed.data.borrower.trim(),
    description: parsed.data.description?.trim() ?? '',
    amount: parsed.data.amount,
    paidAmount: 0,
    date,
    paymentPlan,
    installmentsCount,
    collectionDate,
    note: parsed.data.note?.trim() ?? '',
    abonos: []
  })

  if (!doc) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create prestamo'
    })
  }

  return {
    _id: doc._id.toString(),
    borrower: doc.borrower,
    description: doc.description,
    amount: doc.amount,
    paidAmount: doc.paidAmount,
    pendingAmount: doc.amount,
    status: 'Pendiente' as const,
    date: toIsoDate(doc.date),
    paymentPlan: doc.paymentPlan,
    installmentsCount: doc.installmentsCount,
    collectionDate: doc.collectionDate ? toIsoDate(doc.collectionDate) : null,
    note: doc.note,
    abonos: []
  }
})
