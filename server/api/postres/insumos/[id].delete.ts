import { defineApiHandler } from '../../../utils/handler'
import { defineEventHandler, getRouterParam, createError } from 'h3'
import { connectMongoose } from '../../../utils/mongoose'
import { requireActiveProfile } from '../../../utils/auth'
import { PostreInsumoModel } from '../../../models/postre-insumo'

export default defineApiHandler(async (event) => {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)
  const id = getRouterParam(event, 'id')

  if (!id) throw createError({ statusCode: 400, message: 'ID missing' })

  const deleted = await PostreInsumoModel.findOneAndDelete({ _id: id, profileId })

  if (!deleted) {
    throw createError({ statusCode: 404, message: 'Insumo not found' })
  }

  return { success: true }
})
