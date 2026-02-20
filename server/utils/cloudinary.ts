import { createError } from 'h3'
import { createHash } from 'node:crypto'

export function getCloudinaryConfig() {
  const config = useRuntimeConfig()
  const cloudName = config.cloudinaryCloudName?.trim() || ''
  const apiKey = config.cloudinaryApiKey?.trim() || ''
  const apiSecret = config.cloudinaryApiSecret?.trim() || ''
  const folder = config.cloudinaryUploadFolder?.trim() || 'contabilidad/receipts'

  if (!cloudName || !apiKey || !apiSecret) {
    throw createError({ statusCode: 500, statusMessage: 'Cloudinary is not configured' })
  }

  return {
    cloudName,
    apiKey,
    apiSecret,
    folder
  }
}

export function signCloudinaryParams(params: Record<string, string>, apiSecret: string) {
  const signBase = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')

  return createHash('sha1')
    .update(`${signBase}${apiSecret}`)
    .digest('hex')
}
