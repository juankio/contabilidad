import { defineApiHandler } from '../../../utils/handler'

import { connectMongoose } from '../../../utils/mongoose'
import { requireActiveProfile } from '../../../utils/auth'
import { PostreInsumoModel } from '../../../models/postre-insumo'

export default defineApiHandler(async (event) => {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)

  const insumos = await PostreInsumoModel.find({ profileId }).sort({ name: 1 }).lean()
  return insumos
})
