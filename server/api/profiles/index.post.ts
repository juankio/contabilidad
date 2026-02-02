import { defineEventHandler, readBody, createError } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../utils/mongoose'
import { requireUser } from '../../utils/auth'
import { UserModel } from '../../models/user'
import { serializeProfiles } from '../../utils/serialize'

const payloadSchema = z.object({
  name: z.string().min(2).max(32),
  avatarColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).optional()
})

export default defineEventHandler(async (event) => {
  const body = payloadSchema.safeParse(await readBody(event))
  if (!body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }

  await connectMongoose()
  const user = await requireUser(event)

  const avatarColor = body.data.avatarColor || pickAvatarColor(body.data.name)
  const updated = await UserModel.findByIdAndUpdate(
    user._id,
    { $push: { profiles: { name: body.data.name, avatarColor } } },
    { new: true }
  ).lean()

  return {
    profiles: serializeProfiles(updated?.profiles ?? []),
    activeProfileId: updated?.activeProfileId?.toString() ?? null
  }
})

function pickAvatarColor(seed: string) {
  const palette = ['#E50914', '#F4B400', '#00C853', '#00B0FF', '#7C4DFF', '#FF6D00']
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 33 + seed.charCodeAt(i)) % palette.length
  }
  return palette[Math.abs(hash) % palette.length]
}
