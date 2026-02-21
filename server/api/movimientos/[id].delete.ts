import { createError, defineEventHandler, readBody } from 'h3'
import mongoose from 'mongoose'
import { z } from 'zod'
import { requireActiveProfile } from '../../utils/auth'
import { connectMongoose } from '../../utils/mongoose'
import { GastoModel } from '../../models/gasto'
import { IngresoModel } from '../../models/ingreso'

const payloadSchema = z.object({
  type: z.enum(['Gasto', 'Ingreso'])
})

export default defineEventHandler(async (event) => {
  const movementId = event.context.params?.id
  if (!movementId || !mongoose.Types.ObjectId.isValid(movementId)) {
    throw createError({ statusCode: 400, statusMessage: 'Movimiento invalido' })
  }

  const parsed = payloadSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Tipo de movimiento invalido.' })
  }

  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)
  const model = parsed.data.type === 'Ingreso' ? IngresoModel : GastoModel
  const result = await model.deleteOne({ _id: movementId, profileId })

  if (!result.deletedCount) {
    throw createError({ statusCode: 404, statusMessage: 'Movimiento no encontrado.' })
  }

  return { ok: true, id: movementId, type: parsed.data.type }
})
