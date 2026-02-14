import { createError, defineEventHandler, readBody } from 'h3'
import { OAuth2Client } from 'google-auth-library'
import { z } from 'zod'
import { UserModel } from '../../models/user'
import { setAuthCookie, signAuthToken } from '../../utils/auth'
import { connectMongoose } from '../../utils/mongoose'
import { serializeProfilesFromCategoryStore } from '../../utils/serialize'

const payloadSchema = z.object({
  credential: z.string().min(1)
})

let oauthClient: OAuth2Client | null = null

function getGoogleClientId() {
  const config = useRuntimeConfig()
  const clientId = config.public.googleClientId
  if (!clientId) {
    throw createError({ statusCode: 500, statusMessage: 'GOOGLE_CLIENT_ID is not configured' })
  }
  return clientId
}

function getOAuthClient() {
  if (!oauthClient) {
    oauthClient = new OAuth2Client()
  }
  return oauthClient
}

function pickAvatarColor(seed: string) {
  const palette = ['#E50914', '#F4B400', '#00C853', '#00B0FF', '#7C4DFF', '#FF6D00']
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % palette.length
  }
  return palette[Math.abs(hash) % palette.length]
}

export default defineEventHandler(async (event) => {
  const body = payloadSchema.safeParse(await readBody(event))
  if (!body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }

  const googleClientId = getGoogleClientId()
  const ticket = await getOAuthClient().verifyIdToken({
    idToken: body.data.credential,
    audience: googleClientId
  })

  const payload = ticket.getPayload()
  const email = payload?.email?.toLowerCase().trim()
  if (!payload || !payload.email_verified || !email) {
    throw createError({ statusCode: 401, statusMessage: 'Google account could not be verified' })
  }

  await connectMongoose()

  let user = await UserModel.findOne({ email })
  if (!user) {
    const profileName = payload.name?.trim() || email.split('@')[0] || 'Usuario'
    user = await UserModel.create({
      email,
      passwordHash: null,
      profiles: [{ name: profileName.slice(0, 32), avatarColor: pickAvatarColor(email) }]
    })
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
