import { defineEventHandler } from 'h3'
import { requireUser } from '../../utils/auth'
import { getCloudinaryConfig, signCloudinaryParams } from '../../utils/cloudinary'

export default defineEventHandler(async (event) => {
  await requireUser(event)

  const { cloudName, apiKey, apiSecret, folder } = getCloudinaryConfig()
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const paramsToSign = { folder, timestamp }
  const signature = signCloudinaryParams(paramsToSign, apiSecret)

  return {
    cloudName,
    apiKey,
    folder,
    timestamp,
    signature
  }
})
