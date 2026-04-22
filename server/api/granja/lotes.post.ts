import { defineApiHandler } from '../../utils/handler'
import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { LoteCerdosModel } from '../../models/lote-cerdos'

const schema = z.object({
  nombreLoteMadre: z.string().trim().min(1),
  fechaLlegada: z.string().optional(),
  cantidadInicial: z.preprocess(val => Number(val), z.number().positive())
})

export default defineApiHandler(async (event) => {
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Datos inválidos' })
  }

  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)
  const date = parsed.data.fechaLlegada ? new Date(parsed.data.fechaLlegada) : new Date()

  const doc = await LoteCerdosModel.create({
    profileId,
    nombreLoteMadre: parsed.data.nombreLoteMadre,
    fechaLlegada: date,
    cantidadInicial: parsed.data.cantidadInicial,
    cantidadActual: parsed.data.cantidadInicial
  })

  return doc
})
