import { defineEventHandler } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { IngresoModel } from '../../models/ingreso'
import { toIsoDate } from '../../utils/date'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)
  const ingresos = await IngresoModel.find({ profileId }).sort({ date: -1, _id: -1 }).limit(100).lean()

  return ingresos.map(ingreso => ({
    _id: ingreso._id.toString(),
    description: ingreso.description ?? '',
    category: ingreso.category ?? '',
    amount: Number(ingreso.amount ?? 0),
    date: toIsoDate(ingreso.date)
  }))
})
