import { createError } from 'h3'
import { Resend } from 'resend'

let resendClient: Resend | null = null
let cachedApiKey = ''

export function getResendClient() {
  const config = useRuntimeConfig()
  const apiKey = config.resendApiKey?.trim() || ''

  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'RESEND_API_KEY is not configured' })
  }

  // In dev, env vars can change while the server stays alive.
  if (!resendClient || cachedApiKey !== apiKey) {
    resendClient = new Resend(apiKey)
    cachedApiKey = apiKey
  }

  return resendClient
}

export function getResendFrom() {
  const config = useRuntimeConfig()
  if (!config.resendFrom) {
    throw createError({ statusCode: 500, statusMessage: 'RESEND_FROM is not configured' })
  }
  return config.resendFrom
}
