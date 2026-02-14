import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../../utils/mongoose'
import { requireUser } from '../../../utils/auth'
import { UserModel } from '../../../models/user'
import { removeProfileCategory } from '../../../utils/profile-category-store'
import { serializeProfilesFromCategoryStore } from '../../../utils/serialize'

const payloadSchema = z.object({
  type: z.enum(['income', 'expense']),
  name: z.string().trim().min(1).max(40)
})

export default defineEventHandler(async (event) => {
  const body = payloadSchema.safeParse(await readBody(event))
  if (!body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }

  await connectMongoose()
  const user = await requireUser(event)
  const profileId = event.context.params?.id
  if (!profileId) {
    throw createError({ statusCode: 400, statusMessage: 'Profile id missing' })
  }

  const profileExists = (user.profiles ?? []).some(
    profile => profile._id?.toString() === profileId
  )
  if (!profileExists) {
    throw createError({ statusCode: 404, statusMessage: 'Profile not found' })
  }

  await removeProfileCategory(user._id, profileId, body.data.type, body.data.name)

  const refreshed = await UserModel.findById(user._id).lean()
  if (!refreshed) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  return {
    profiles: await serializeProfilesFromCategoryStore(user._id, refreshed.profiles ?? []),
    activeProfileId: refreshed.activeProfileId?.toString() ?? null
  }
})
