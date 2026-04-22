import { defineApiHandler } from '../../utils/handler'
import { defineEventHandler } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { PostreModel } from '../../models/postre'

export default defineApiHandler(async (event) => {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)

  const postres = await PostreModel.find({ profileId }).populate('receta.insumoId').sort({ name: 1 }).lean()
  return postres
})
