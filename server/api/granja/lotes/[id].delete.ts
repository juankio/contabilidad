import { defineApiHandler } from '../../../utils/handler'
import { createError, defineEventHandler } from 'h3'
import { connectMongoose } from '../../../utils/mongoose'
import { requireActiveProfile } from '../../../utils/auth'
import { LoteCerdosModel } from '../../../models/lote-cerdos'

export default defineApiHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID requerido' })
  }

  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)

  const doc = await LoteCerdosModel.findOneAndDelete({ _id: id, profileId })

  if (!doc) {
    throw createError({ statusCode: 404, statusMessage: 'Lote no encontrado' })
  }

  return { success: true, id: doc._id }
})
