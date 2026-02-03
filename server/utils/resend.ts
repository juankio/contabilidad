import { createError } from 'h3'
import { Resend } from 'resend'

let resendClient: Resend | null = null

export function getResendClient() {
  const config = useRuntimeConfig()
  if (!config.resendApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'RESEND_API_KEY is not configured' })
  }
  if (!resendClient) {
    resendClient = new Resend(config.resendApiKey)
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
