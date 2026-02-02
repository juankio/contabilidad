import type { H3Event } from 'h3'
import { createError, deleteCookie, getCookie, setCookie } from 'h3'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/user'

type AuthTokenPayload = {
  sub: string
}

function getAuthConfig() {
  const config = useRuntimeConfig()
  const secret = config.authSecret
  if (!secret) {
    throw createError({ statusCode: 500, statusMessage: 'AUTH_SECRET is not configured' })
  }
  return {
    secret,
    cookieName: config.authCookieName || 'contabilidad_auth'
  }
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash)
}

export function signAuthToken(userId: string) {
  const { secret } = getAuthConfig()
  return jwt.sign({ sub: userId } satisfies AuthTokenPayload, secret, { expiresIn: '30d' })
}

export function verifyAuthToken(token: string) {
  const { secret } = getAuthConfig()
  return jwt.verify(token, secret) as AuthTokenPayload
}

export function setAuthCookie(event: H3Event, token: string) {
  const { cookieName } = getAuthConfig()
  setCookie(event, cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  })
}

export function clearAuthCookie(event: H3Event) {
  const { cookieName } = getAuthConfig()
  deleteCookie(event, cookieName, { path: '/' })
}

export async function getUserFromEvent(event: H3Event) {
  const { cookieName } = getAuthConfig()
  const token = getCookie(event, cookieName)
  if (!token) {
    return null
  }
  try {
    const payload = verifyAuthToken(token)
    const user = await UserModel.findById(payload.sub).lean()
    return user
  } catch {
    return null
  }
}

export async function requireUser(event: H3Event) {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return user
}

export async function requireActiveProfile(event: H3Event) {
  const user = await requireUser(event)
  const profileId = user.activeProfileId?.toString()
  if (!profileId) {
    throw createError({ statusCode: 409, statusMessage: 'Active profile required' })
  }
  return { user, profileId }
}
