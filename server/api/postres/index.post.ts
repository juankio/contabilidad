import { defineApiHandler } from '../../utils/handler'
import { defineEventHandler, readBody } from 'h3'
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
  
  const body = await readBody(event)
  const parsed = PostreSchema.parse(body)

  const newPostre = new PostreModel({
    ...parsed,
    profileId
  })

  await newPostre.save()
  return newPostre
})
