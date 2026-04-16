import { defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../../utils/mongoose'
import { requireActiveProfile } from '../../../utils/auth'
import { PostreVentaModel } from '../../../models/postre-venta'

const VentaSchema = z.object({
  postreId: z.string().min(1),
  qty: z.number().min(1),
  date: z.string().or(z.date()).transform(val => new Date(val))
})

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)
  
  const body = await readBody(event)
  const parsed = VentaSchema.parse(body)

  const newVenta = new PostreVentaModel({
    ...parsed,
    profileId
  })

  await newVenta.save()
  return newVenta
})
