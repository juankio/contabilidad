import { defineEventHandler, readBody, createError } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../utils/mongoose'
import { requireUser } from '../../utils/auth'
import { UserModel } from '../../models/user'
import { serializeProfilesFromCategoryStore } from '../../utils/serialize'
import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
  normalizeDefaultVisibility
} from '../../utils/profile-categories'

const payloadSchema = z.object({
  name: z.string().min(2).max(32).optional(),
  avatarColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).optional(),
  hiddenIncomeDefaults: z.array(z.string()).optional(),
  hiddenExpenseDefaults: z.array(z.string()).optional()
})

export default defineEventHandler(async (event) => {
  const body = payloadSchema.safeParse(await readBody(event))
  if (!body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }

  await connectMongoose()
  const user = await requireUser(event)
  const profileId = event.context.params?.id
  if (!profileId) {
    throw createError({ statusCode: 400, statusMessage: 'Profile id missing' })
  }

  const update: Record<string, string | string[]> = {}
  if (body.data.name) update['profiles.$.name'] = body.data.name
  if (body.data.avatarColor) update['profiles.$.avatarColor'] = body.data.avatarColor
  if (body.data.hiddenIncomeDefaults) {
    update['profiles.$.hiddenIncomeDefaults'] = normalizeDefaultVisibility(
      body.data.hiddenIncomeDefaults,
      DEFAULT_INCOME_CATEGORIES
    )
  }
  if (body.data.hiddenExpenseDefaults) {
    update['profiles.$.hiddenExpenseDefaults'] = normalizeDefaultVisibility(
      body.data.hiddenExpenseDefaults,
      DEFAULT_EXPENSE_CATEGORIES
    )
  }

  const query: Record<string, unknown> = { _id: user._id }
  query['profiles._id'] = profileId
  const updated = await UserModel.findOneAndUpdate(
    query,
    { $set: update },
    { new: true }
  ).lean()

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Profile not found' })
  }

  return {
    profiles: await serializeProfilesFromCategoryStore(user._id, updated.profiles ?? []),
    activeProfileId: updated.activeProfileId?.toString() ?? null
  }
})
