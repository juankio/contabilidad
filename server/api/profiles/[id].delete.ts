import { defineEventHandler, createError } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireUser } from '../../utils/auth'
import { UserModel } from '../../models/user'
import { serializeProfiles } from '../../utils/serialize'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const user = await requireUser(event)
  const profileId = event.context.params?.id
  if (!profileId) {
    throw createError({ statusCode: 400, statusMessage: 'Profile id missing' })
  }

  const updated = await UserModel.findByIdAndUpdate(
    user._id,
    {
      $pull: { profiles: { _id: profileId } },
      ...(user.activeProfileId?.toString() === profileId ? { activeProfileId: null } : {})
    },
    { new: true }
  ).lean()

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Profile not found' })
  }

  return {
    profiles: serializeProfiles(updated.profiles ?? []),
    activeProfileId: updated.activeProfileId?.toString() ?? null
  }
})
