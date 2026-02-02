import { defineEventHandler, readBody, createError } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../utils/mongoose'
import { UserModel } from '../../models/user'
import { hashPassword, setAuthCookie, signAuthToken } from '../../utils/auth'
import { serializeProfiles } from '../../utils/serialize'

const payloadSchema = z.object({
  email: z.string().email().transform(value => value.toLowerCase().trim()),
  password: z.string().min(8),
  profileName: z.string().min(2).max(32).optional()
})

export default defineEventHandler(async (event) => {
  const body = payloadSchema.safeParse(await readBody(event))
  if (!body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }

  await connectMongoose()

  const exists = await UserModel.findOne({ email: body.data.email }).lean()
  if (exists) {
    throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
  }

  const passwordHash = await hashPassword(body.data.password)
  const profileName = body.data.profileName || 'Principal'
  const avatarColor = pickAvatarColor(body.data.email)

  const user = await UserModel.create({
    email: body.data.email,
    passwordHash,
    profiles: [{ name: profileName, avatarColor }]
  })

  const token = signAuthToken(user._id.toString())
  setAuthCookie(event, token)

  return {
    id: user._id,
    email: user.email,
    profiles: serializeProfiles(user.profiles),
    activeProfileId: user.activeProfileId?.toString() ?? null
  }
})

function pickAvatarColor(seed: string) {
  const palette = ['#E50914', '#F4B400', '#00C853', '#00B0FF', '#7C4DFF', '#FF6D00']
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % palette.length
  }
  return palette[Math.abs(hash) % palette.length]
}
