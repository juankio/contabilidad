import { defineApiHandler } from '../../utils/handler'
import { readBody, getRouterParam, createError } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { PostreModel } from '../../models/postre'

const PostreSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
  receta: z.array(z.object({
    insumoId: z.string().min(1),
    yields: z.number().min(0)
  }))
})

export default defineApiHandler(async (event) => {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)
  const id = getRouterParam(event, 'id')

  if (!id) throw createError({ statusCode: 400, message: 'ID missing' })

  const body = await readBody(event)
  const parsed = PostreSchema.parse(body)

  const updatedPostre = await PostreModel.findOneAndUpdate(
    { _id: id, profileId },
    parsed,
    { new: true }
  )

  if (!updatedPostre) {
    throw createError({ statusCode: 404, message: 'Postre not found' })
  }

  return updatedPostre
})
