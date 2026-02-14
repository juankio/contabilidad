import { defineEventHandler } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireUser } from '../../utils/auth'
import { serializeProfilesFromCategoryStore } from '../../utils/serialize'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const user = await requireUser(event)
  return {
    profiles: await serializeProfilesFromCategoryStore(user._id, user.profiles ?? []),
    activeProfileId: user.activeProfileId?.toString() ?? null
  }
})
