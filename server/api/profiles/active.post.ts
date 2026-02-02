import { defineEventHandler, readBody, createError } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../utils/mongoose'
import { requireUser } from '../../utils/auth'
import { UserModel, type ProfileDocument } from '../../models/user'
import { serializeProfiles } from '../../utils/serialize'

const payloadSchema = z.object({
  profileId: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  const body = payloadSchema.safeParse(await readBody(event))
  if (!body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }

  await connectMongoose()
  const user = await requireUser(event)

  const profileExists = (user.profiles || []).some(
    (profile: ProfileDocument) => profile._id?.toString() === body.data.profileId
  )
  if (!profileExists) {
    throw createError({ statusCode: 404, statusMessage: 'Profile not found' })
  }

  const updated = await UserModel.findByIdAndUpdate(
    user._id,
    { activeProfileId: body.data.profileId },
    { new: true }
  ).lean()

  return {
    profiles: serializeProfiles(updated?.profiles ?? []),
    activeProfileId: updated?.activeProfileId?.toString() ?? null
  }
})
