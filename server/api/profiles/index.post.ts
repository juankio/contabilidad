import { defineApiHandler } from '../../utils/handler'
import { readBody, createError } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../utils/mongoose'
import { requireUser } from '../../utils/auth'
import { UserModel } from '../../models/user'
import { serializeProfilesFromCategoryStore } from '../../utils/serialize'
import { normalizeModules } from '../../utils/modules'
import { normalizeProfileIcon } from '../../utils/profile-icons'
import { THEME_COLOR_KEYS, normalizeThemeColor } from '../../utils/theme'

const payloadSchema = z.object({
  name: z.string().min(2).max(32),
  avatarColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).optional(),
  themeColor: z.enum(THEME_COLOR_KEYS).optional(),
  modules: z.array(z.string()).optional(),
  avatarIcon: z.string().min(1).max(64).optional()
})

export default defineApiHandler(async (event) => {
  const body = payloadSchema.safeParse(await readBody(event))
  if (!body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }

  await connectMongoose()
  const user = await requireUser(event)

  const avatarColor = body.data.avatarColor || pickAvatarColor(body.data.name)
  const themeColor = normalizeThemeColor(body.data.themeColor)
  const modules = normalizeModules(body.data.modules)
  const avatarIcon = normalizeProfileIcon(body.data.avatarIcon)
  const updated = await UserModel.findByIdAndUpdate(
    user._id,
    { $push: { profiles: { name: body.data.name, avatarColor, themeColor, avatarIcon, modules } } },
    { new: true }
  ).lean()

  return {
    profiles: await serializeProfilesFromCategoryStore(user._id, updated?.profiles ?? []),
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
