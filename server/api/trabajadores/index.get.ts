import { defineApiHandler } from '../../utils/handler'

import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { TrabajadorModel } from '../../models/trabajador'

export default defineApiHandler(async (event) => {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)

  const trabajadores = await TrabajadorModel.find({ profileId, activo: true }).sort({ nombre: 1 }).lean()
  return trabajadores
})
