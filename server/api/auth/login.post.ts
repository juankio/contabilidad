import { defineEventHandler, readBody, createError } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../utils/mongoose'
import { UserModel } from '../../models/user'
import { setAuthCookie, signAuthToken, verifyPassword } from '../../utils/auth'
import { serializeProfilesFromCategoryStore } from '../../utils/serialize'

const payloadSchema = z.object({
  email: z.string().email().transform(value => value.toLowerCase().trim()),
  password: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  const body = payloadSchema.safeParse(await readBody(event))
  if (!body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }

  await connectMongoose()
  const user = await UserModel.findOne({ email: body.data.email })
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  if (!user.passwordHash) {
    throw createError({ statusCode: 401, statusMessage: 'Use Google sign-in for this account' })
  }

  const ok = await verifyPassword(body.data.password, user.passwordHash)
  if (!ok) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  if (!user.activeProfileId && user.profiles.length > 0) {
    const firstProfile = user.profiles[0]
    if (firstProfile?._id) {
      user.activeProfileId = firstProfile._id
      await user.save()
    }
  }

  const token = signAuthToken(user._id.toString())
  setAuthCookie(event, token)

  return {
    id: user._id,
    email: user.email,
    profiles: await serializeProfilesFromCategoryStore(user._id, user.profiles),
    activeProfileId: user.activeProfileId?.toString() ?? null
  }
})
