import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { PagoTrabajadorModel } from '../../models/pago-trabajador'
import { getAvailableBalance } from '../../utils/balance'

const schema = z.object({
  trabajadorId: z.string().trim().min(1),
  amount: z.preprocess(val => Number(val), z.number().positive()),
  tipo: z.enum(['quincena', 'adelanto', 'liquidacion']),
  note: z.string().trim().optional(),
  date: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Datos inválidos' })
  }

  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)

  const balanceActual = await getAvailableBalance(profileId)
  if (parsed.data.amount > balanceActual) {
    throw createError({
      statusCode: 400,
      statusMessage: `Fondos insuficientes. Intentas pagar $${parsed.data.amount} pero solo tienes $${balanceActual} disponibles.`
    })
  }

  const date = parsed.data.date ? new Date(parsed.data.date) : new Date()

  const doc = await PagoTrabajadorModel.create({
    profileId,
    trabajadorId: parsed.data.trabajadorId,
    amount: parsed.data.amount,
    tipo: parsed.data.tipo,
    note: parsed.data.note ?? '',
    date
  })

  return doc
})
