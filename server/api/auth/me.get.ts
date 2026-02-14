import { defineEventHandler } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { getUserFromEvent } from '../../utils/auth'
import { serializeProfilesFromCategoryStore } from '../../utils/serialize'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const user = await getUserFromEvent(event)
  if (!user) {
    return { user: null }
  }

  return {
    user: {
      id: user._id,
      email: user.email,
      profiles: await serializeProfilesFromCategoryStore(user._id, user.profiles),
      activeProfileId: user.activeProfileId?.toString() ?? null
    }
  }
})
