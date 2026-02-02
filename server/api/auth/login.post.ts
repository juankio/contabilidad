import { defineEventHandler, readBody, createError } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../utils/mongoose'
import { UserModel } from '../../models/user'
import { setAuthCookie, signAuthToken, verifyPassword } from '../../utils/auth'
import { serializeProfiles } from '../../utils/serialize'

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

  const ok = await verifyPassword(body.data.password, user.passwordHash)
  if (!ok) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const token = signAuthToken(user._id.toString())
  setAuthCookie(event, token)

  return {
    id: user._id,
    email: user.email,
    profiles: serializeProfiles(user.profiles),
    activeProfileId: user.activeProfileId?.toString() ?? null
  }
})
