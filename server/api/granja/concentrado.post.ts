import { defineApiHandler } from '../../utils/handler'
import { createError, readBody } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { CompraConcentradoModel } from '../../models/compra-concentrado'

const schema = z.object({
  formula: z.string().trim().min(1),
  kilos: z.preprocess(val => Number(val), z.number().positive()),
  amount: z.preprocess(val => Number(val), z.number().positive()),
  note: z.string().trim().optional(),
  date: z.string().optional()
})

export default defineApiHandler(async (event) => {
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Datos inválidos' })
  }

  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)

  // Se permite saldo negativo en la realidad contable.

  const date = parsed.data.date ? new Date(parsed.data.date) : new Date()

  const doc = await CompraConcentradoModel.create({
    profileId,
    formula: parsed.data.formula,
    kilos: parsed.data.kilos,
    amount: parsed.data.amount,
    note: parsed.data.note ?? '',
    date
  })

  return doc
})
