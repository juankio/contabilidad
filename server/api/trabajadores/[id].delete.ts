import { defineApiHandler } from '../../utils/handler'
import { createError } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { TrabajadorModel } from '../../models/trabajador'

export default defineApiHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID requerido' })
  }

  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)

  const doc = await TrabajadorModel.findOneAndUpdate(
    { _id: id, profileId },
    { activo: false },
    { new: true }
  )

  if (!doc) {
    throw createError({ statusCode: 404, statusMessage: 'Trabajador no encontrado' })
  }

  return { success: true }
})
