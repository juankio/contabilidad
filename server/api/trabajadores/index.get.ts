import { defineEventHandler } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { TrabajadorModel } from '../../models/trabajador'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)

  const trabajadores = await TrabajadorModel.find({ profileId, activo: true }).sort({ nombre: 1 }).lean()
  return trabajadores
})
