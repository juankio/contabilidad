import { defineEventHandler } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { GastoModel } from '../../models/gasto'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)
  const gastos = await GastoModel.find({ profileId }).sort({ date: -1 }).limit(100).lean()

  return gastos.map(gasto => ({
    _id: gasto._id.toString(),
    description: gasto.description ?? '',
    category: gasto.category ?? '',
    amount: Number(gasto.amount ?? 0),
    date: gasto.date instanceof Date ? gasto.date.toISOString() : new Date().toISOString()
  }))
})
