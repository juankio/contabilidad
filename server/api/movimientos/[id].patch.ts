import { createError, defineEventHandler, readBody } from 'h3'
import mongoose from 'mongoose'
import { z } from 'zod'
import { requireActiveProfile } from '../../utils/auth'
import { connectMongoose } from '../../utils/mongoose'
import { GastoModel } from '../../models/gasto'
import { IngresoModel } from '../../models/ingreso'
import { toIsoDate } from '../../utils/date'
import { upsertProfileCategory } from '../../utils/profile-category-store'

const payloadSchema = z.object({
  type: z.enum(['Gasto', 'Ingreso']),
  description: z.string().trim().min(1),
  category: z.string().trim().min(1).max(40),
  amount: z.preprocess(value => Number(value), z.number().positive()),
  date: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const movementId = event.context.params?.id
  if (!movementId || !mongoose.Types.ObjectId.isValid(movementId)) {
    throw createError({ statusCode: 400, statusMessage: 'Movimiento invalido' })
  }

  const parsed = payloadSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Datos invalidos para actualizar.' })
  }

  const update: Record<string, unknown> = {
    description: parsed.data.description.trim(),
    category: parsed.data.category.trim(),
    amount: parsed.data.amount
  }
  if (parsed.data.date) {
    const parsedDate = new Date(parsed.data.date)
    if (Number.isNaN(parsedDate.getTime())) {
      throw createError({ statusCode: 400, statusMessage: 'La fecha no es valida.' })
    }
    update.date = parsedDate
  }

  await connectMongoose()
  const { user, profileId } = await requireActiveProfile(event)
  const model = parsed.data.type === 'Ingreso' ? IngresoModel : GastoModel
  const categoryType = parsed.data.type === 'Ingreso' ? 'income' : 'expense'
  const doc = await model.findOneAndUpdate(
    { _id: movementId, profileId },
    {
      $set: update
    },
    { new: true }
  ).lean()

  if (!doc) {
    throw createError({ statusCode: 404, statusMessage: 'Movimiento no encontrado.' })
  }

  try {
    await upsertProfileCategory(user._id, profileId, categoryType, doc.category)
  } catch {
    // Keep movement update successful even if category sync fails.
  }

  return {
    _id: doc._id.toString(),
    type: parsed.data.type,
    description: doc.description ?? '',
    category: doc.category ?? '',
    amount: Number(doc.amount ?? 0),
    date: toIsoDate(doc.date)
  }
})
