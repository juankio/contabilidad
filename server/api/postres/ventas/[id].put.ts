import { defineEventHandler, readBody, getRouterParam, createError } from 'h3'
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
  const id = getRouterParam(event, 'id')

  if (!id) throw createError({ statusCode: 400, message: 'ID missing' })

  const body = await readBody(event)
  const parsed = VentaSchema.parse(body)

  const updatedVenta = await PostreVentaModel.findOneAndUpdate(
    { _id: id, profileId },
    parsed,
    { new: true }
  )

  if (!updatedVenta) {
    throw createError({ statusCode: 404, message: 'Venta not found' })
  }

  return updatedVenta
})
