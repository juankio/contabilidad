import { createError, defineEventHandler, getRouterParam } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { PlanCompraModel } from '../../models/plan-compra'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)

  const doc = await PlanCompraModel.findOneAndDelete({ _id: id, profileId })

  if (!doc) {
    throw createError({ statusCode: 404, statusMessage: 'Plan no encontrado' })
  }

  return { success: true }
})
