import { defineApiHandler } from '../../utils/handler'
import { getRouterParam, createError } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { PostreModel } from '../../models/postre'

export default defineApiHandler(async (event) => {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)
  const id = getRouterParam(event, 'id')

  if (!id) throw createError({ statusCode: 400, message: 'ID missing' })

  const deleted = await PostreModel.findOneAndDelete({ _id: id, profileId })

  if (!deleted) {
    throw createError({ statusCode: 404, message: 'Postre not found' })
  }

  return { success: true }
})
