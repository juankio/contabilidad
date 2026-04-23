import { defineApiHandler } from '../../../utils/handler'

import { connectMongoose } from '../../../utils/mongoose'
import { requireActiveProfile } from '../../../utils/auth'
import { PostreVentaModel } from '../../../models/postre-venta'

export default defineApiHandler(async (event) => {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)

  const ventas = await PostreVentaModel.find({ profileId }).populate('postreId').sort({ date: -1 }).lean()
  return ventas
})
