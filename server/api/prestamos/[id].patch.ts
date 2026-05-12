import { defineApiHandler } from '../../utils/handler'
import { createError, readBody } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { PrestamoModel } from '../../models/prestamo'
import { toIsoDate } from '../../utils/date'

const prestamoEditSchema = z.object({
  borrower: z.string().trim().min(1).max(60).optional(),
  description: z.string().trim().max(120).optional(),
  amount: z.preprocess(val => val === undefined ? undefined : Number(val), z.number().positive().optional()),
  date: z.string().optional(),
  collectionDate: z.string().nullable().optional(),
  note: z.string().trim().max(160).optional()
})

export default defineApiHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID requerido' })
  }

  const body = await readBody(event)
  const parsed = prestamoEditSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues.map(issue => issue.message).join(', ')
    })
  }

  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)

  const prestamo = await PrestamoModel.findOne({ _id: id, profileId })
  if (!prestamo) {
    throw createError({ statusCode: 404, statusMessage: 'Préstamo no encontrado' })
  }

  const { amount: newAmount, date: newDateStr, collectionDate: newCollectionDateStr, ...rest } = parsed.data

  if (newAmount !== undefined) {
    if (newAmount < prestamo.paidAmount) {
      throw createError({
        statusCode: 400,
        statusMessage: `El monto no puede ser menor a lo que ya se ha pagado ($${prestamo.paidAmount}).`
      })
    }

    if (newAmount > prestamo.amount) {
      // Se permite que el saldo quede negativo en la realidad si se presta más dinero
    }
    prestamo.amount = newAmount
  }

  if (newDateStr !== undefined) {
    const date = new Date(newDateStr)
    if (Number.isNaN(date.getTime())) {
      throw createError({ statusCode: 400, statusMessage: 'Fecha inválida' })
    }
    prestamo.date = date
  }

  if (newCollectionDateStr !== undefined) {
    if (newCollectionDateStr === null) {
      prestamo.collectionDate = null
    } else {
      const colDate = new Date(newCollectionDateStr)
      if (Number.isNaN(colDate.getTime())) {
        throw createError({ statusCode: 400, statusMessage: 'Fecha de cobro inválida' })
      }
      prestamo.collectionDate = colDate
    }
  }

  if (rest.borrower !== undefined) prestamo.borrower = rest.borrower
  if (rest.description !== undefined) prestamo.description = rest.description
  if (rest.note !== undefined) prestamo.note = rest.note

  await prestamo.save()

  const pendingAmount = prestamo.amount - prestamo.paidAmount
  const status = pendingAmount <= 0 ? 'Pagado' : 'Pendiente'

  return {
    _id: prestamo._id.toString(),
    borrower: prestamo.borrower,
    description: prestamo.description,
    amount: prestamo.amount,
    paidAmount: prestamo.paidAmount,
    pendingAmount,
    status,
    date: toIsoDate(prestamo.date),
    paymentPlan: prestamo.paymentPlan,
    installmentsCount: prestamo.installmentsCount,
    collectionDate: prestamo.collectionDate ? toIsoDate(prestamo.collectionDate) : null,
    note: prestamo.note,
    abonos: prestamo.abonos.map(a => ({
      _id: a._id.toString(),
      amount: a.amount,
      date: toIsoDate(a.date),
      note: a.note
    }))
  }
})
