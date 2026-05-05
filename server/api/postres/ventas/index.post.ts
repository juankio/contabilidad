import { defineApiHandler } from '../../../utils/handler'
import { createError, readBody } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../../utils/mongoose'
import { requireActiveProfile } from '../../../utils/auth'
import { PostreVentaModel } from '../../../models/postre-venta'
import { PostreModel } from '../../../models/postre'
import { IngresoModel } from '../../../models/ingreso'

const VentaSchema = z.object({
  postreId: z.string().min(1),
  qty: z.number().min(1),
  date: z.string().or(z.date()).transform(val => new Date(val))
})

export default defineApiHandler(async (event) => {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)

  const body = await readBody(event)
  const parsed = VentaSchema.parse(body)

  const postre = await PostreModel.findById(parsed.postreId)
  if (!postre) {
    throw createError({ statusCode: 404, statusMessage: 'Postre no encontrado' })
  }

  const newVenta = new PostreVentaModel({
    ...parsed,
    profileId
  })

  await newVenta.save()

  await IngresoModel.create({
    profileId,
    description: `Venta de ${parsed.qty}x ${postre.name}`,
    category: 'Venta Postres',
    amount: postre.price * parsed.qty,
    date: parsed.date
  })

  return newVenta
})
