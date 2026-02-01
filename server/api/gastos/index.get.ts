import { defineEventHandler } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { GastoModel } from '../../models/gasto'

export default defineEventHandler(async () => {
  await connectMongoose()
  const gastos = await GastoModel.find().sort({ date: -1 }).limit(100).lean()

  return gastos.map(gasto => ({
    _id: gasto._id.toString(),
    description: gasto.description ?? '',
    category: gasto.category ?? '',
    amount: Number(gasto.amount ?? 0),
    date: gasto.date instanceof Date ? gasto.date.toISOString() : new Date().toISOString()
  }))
})
