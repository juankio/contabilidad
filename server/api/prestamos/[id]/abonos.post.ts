import { defineApiHandler } from '../../../utils/handler'
import { createError, readBody } from 'h3'
import mongoose from 'mongoose'
import { z } from 'zod'
import { requireActiveProfile } from '../../../utils/auth'
import { connectMongoose } from '../../../utils/mongoose'
import { PrestamoModel } from '../../../models/prestamo'
import { toIsoDate } from '../../../utils/date'

const abonoSchema = z.object({
  amount: z.preprocess(value => Number(value), z.number().positive()),
  date: z.string().optional(),
  note: z.string().trim().max(160).optional()
})

export default defineApiHandler(async (event) => {
  const prestamoId = event.context.params?.id
  if (!prestamoId || !mongoose.Types.ObjectId.isValid(prestamoId)) {
    throw createError({ statusCode: 400, statusMessage: 'Prestamo invalido' })
  }

  const parsed = abonoSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues.map(issue => issue.message).join(', ')
    })
  }

  const date = parsed.data.date ? new Date(parsed.data.date) : new Date()
  if (Number.isNaN(date.getTime())) {
    throw createError({ statusCode: 400, statusMessage: 'date must be a valid ISO string' })
  }

  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)

  const prestamo = await PrestamoModel.findOne({ _id: prestamoId, profileId }).lean()
  if (!prestamo) {
    throw createError({ statusCode: 404, statusMessage: 'Prestamo no encontrado.' })
  }

  const amount = Number(prestamo.amount ?? 0)
  const paidAmount = Number(prestamo.paidAmount ?? 0)
  const pendingAmount = Math.max(0, amount - paidAmount)
  const currentAbonosCount = Array.isArray(prestamo.abonos) ? prestamo.abonos.length : 0
  const isInstallmentsPlan = prestamo.paymentPlan === 'installments'
  const installmentsCount = Number(prestamo.installmentsCount ?? 0)

  if (!pendingAmount) {
    throw createError({ statusCode: 409, statusMessage: 'Este prestamo ya esta pagado.' })
  }

  if (isInstallmentsPlan && installmentsCount > 0 && currentAbonosCount >= installmentsCount) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Este prestamo ya completo el numero de cuotas configurado.'
    })
  }

  const isLastInstallment = isInstallmentsPlan
    && installmentsCount > 0
    && currentAbonosCount + 1 === installmentsCount

  if (isLastInstallment && parsed.data.amount !== pendingAmount) {
    throw createError({
      statusCode: 400,
      statusMessage: 'La ultima cuota debe cubrir todo el saldo pendiente.'
    })
  }

  if (parsed.data.amount > pendingAmount) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El abono supera el saldo pendiente del prestamo.'
    })
  }

  const updated = await PrestamoModel.findOneAndUpdate(
    { _id: prestamoId, profileId },
    {
      $set: { paidAmount: paidAmount + parsed.data.amount },
      $push: {
        abonos: {
          amount: parsed.data.amount,
          date,
          note: parsed.data.note?.trim() ?? ''
        }
      }
    },
    { new: true }
  ).lean()

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Prestamo no encontrado.' })
  }

  const nextPendingAmount = Math.max(0, Number(updated.amount ?? 0) - Number(updated.paidAmount ?? 0))
  const abonos = [...(updated.abonos ?? [])]
    .sort((a, b) => getTime(b.date) - getTime(a.date))
    .map(abono => ({
      _id: abono._id.toString(),
      amount: Number(abono.amount ?? 0),
      date: toIsoDate(abono.date),
      note: abono.note ?? ''
    }))

  return {
    _id: updated._id.toString(),
    borrower: updated.borrower ?? '',
    description: updated.description ?? '',
    amount: Number(updated.amount ?? 0),
    paidAmount: Number(updated.paidAmount ?? 0),
    pendingAmount: nextPendingAmount,
    status: nextPendingAmount > 0 ? 'Pendiente' : 'Pagado',
    date: toIsoDate(updated.date),
    paymentPlan: updated.paymentPlan === 'installments' ? 'installments' : 'single',
    installmentsCount: updated.installmentsCount ? Number(updated.installmentsCount) : null,
    collectionDate: updated.collectionDate ? toIsoDate(updated.collectionDate) : null,
    note: updated.note ?? '',
    abonos
  }
})

function getTime(value: unknown) {
  const parsed = new Date(value as string | number | Date)
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime()
}
