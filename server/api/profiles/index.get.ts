import { defineEventHandler } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireUser } from '../../utils/auth'
import { serializeProfiles } from '../../utils/serialize'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const user = await requireUser(event)
  return {
    profiles: serializeProfiles(user.profiles ?? []),
    activeProfileId: user.activeProfileId?.toString() ?? null
  }
})
