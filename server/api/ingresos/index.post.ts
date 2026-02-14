import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { IngresoModel } from '../../models/ingreso'
import { upsertProfileCategory } from '../../utils/profile-category-store'

const ingresoSchema = z.object({
  description: z.string().trim().min(1),
  category: z.string().trim().min(1).default('Otros'),
  amount: z.preprocess(value => Number(value), z.number().positive()),
  date: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = ingresoSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues.map(issue => issue.message).join(', ')
    })
  }

  const date = parsed.data.date ? new Date(parsed.data.date) : new Date()
  if (Number.isNaN(date.getTime())) {
    throw createError({
      statusCode: 400,
      statusMessage: 'date must be a valid ISO string'
    })
  }

  await connectMongoose()
  const { profileId, user } = await requireActiveProfile(event)
  const doc = await IngresoModel.create({
    profileId,
    description: parsed.data.description.trim(),
    category: parsed.data.category.trim(),
    amount: parsed.data.amount,
    date
  })

  try {
    await upsertProfileCategory(user._id, profileId, 'income', doc.category)
  } catch {
    // Keep movement creation successful even if category sync fails.
  }

  return {
    _id: doc._id.toString(),
    description: doc.description,
    category: doc.category,
    amount: doc.amount,
    date: doc.date.toISOString()
  }
})
