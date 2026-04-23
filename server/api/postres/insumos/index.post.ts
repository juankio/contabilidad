import { defineApiHandler } from '../../../utils/handler'
import { readBody } from 'h3'
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

  const body = await readBody(event)
  const parsed = InsumoSchema.parse(body)

  const newInsumo = new PostreInsumoModel({
    ...parsed,
    profileId
  })

  await newInsumo.save()
  return newInsumo
})
