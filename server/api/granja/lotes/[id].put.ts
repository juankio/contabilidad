import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../../utils/mongoose'
import { requireActiveProfile } from '../../../utils/auth'
import { LoteCerdosModel } from '../../../models/lote-cerdos'

const schema = z.object({
  nombreLoteMadre: z.string().trim().min(1)
})

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID requerido' })
  }

  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Datos inválidos' })
  }

  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)

  const doc = await LoteCerdosModel.findOneAndUpdate(
    { _id: id, profileId },
    { $set: { nombreLoteMadre: parsed.data.nombreLoteMadre } },
    { new: true }
  )

  if (!doc) {
    throw createError({ statusCode: 404, statusMessage: 'Lote no encontrado' })
  }

  return doc
})
