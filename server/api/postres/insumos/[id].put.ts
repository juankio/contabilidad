import { defineApiHandler } from '../../../utils/handler'
import { readBody, getRouterParam, createError } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../../utils/mongoose'
import { requireActiveProfile } from '../../../utils/auth'
import { PostreInsumoModel } from '../../../models/postre-insumo'

const InsumoSchema = z.object({
  name: z.string().min(1),
  unit: z.string().min(1),
  cost: z.number().min(0)
})

export default defineApiHandler(async (event) => {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)
  const id = getRouterParam(event, 'id')

  if (!id) throw createError({ statusCode: 400, message: 'ID missing' })

  const body = await readBody(event)
  const parsed = InsumoSchema.parse(body)

  const updatedInsumo = await PostreInsumoModel.findOneAndUpdate(
    { _id: id, profileId },
    parsed,
    { new: true }
  )

  if (!updatedInsumo) {
    throw createError({ statusCode: 404, message: 'Insumo not found' })
  }

  return updatedInsumo
})
