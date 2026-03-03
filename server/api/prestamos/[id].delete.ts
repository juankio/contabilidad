import { createError, defineEventHandler } from 'h3'
import mongoose from 'mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { connectMongoose } from '../../utils/mongoose'
import { PrestamoModel } from '../../models/prestamo'

export default defineEventHandler(async (event) => {
  const prestamoId = event.context.params?.id
  if (!prestamoId || !mongoose.Types.ObjectId.isValid(prestamoId)) {
    throw createError({ statusCode: 400, statusMessage: 'Prestamo invalido' })
  }

  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)
  const result = await PrestamoModel.deleteOne({ _id: prestamoId, profileId })

  if (!result.deletedCount) {
    throw createError({ statusCode: 404, statusMessage: 'Prestamo no encontrado.' })
  }

  return { ok: true, id: prestamoId }
})
