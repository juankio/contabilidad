import { defineApiHandler } from '../../utils/handler'
import { defineEventHandler } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { LoteCerdosModel } from '../../models/lote-cerdos'

export default defineApiHandler(async (event) => {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)
  return await LoteCerdosModel.find({ profileId }).sort({ createdAt: -1 }).lean()
})
