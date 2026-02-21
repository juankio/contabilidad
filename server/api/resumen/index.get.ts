import { defineEventHandler } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import mongoose from 'mongoose'
import { GastoModel } from '../../models/gasto'
import { IngresoModel } from '../../models/ingreso'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)
  const profileObjectId = new mongoose.Types.ObjectId(profileId)

  const now = new Date()
  const start = getMonthStartUTC(now)
  const end = getNextMonthStartUTC(now)

  const [ingresosAgg, gastosAgg] = await Promise.all([
    IngresoModel.aggregate([
      { $match: { profileId: profileObjectId, date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    GastoModel.aggregate([
      { $match: { profileId: profileObjectId, date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
  ])

  const ingresos = ingresosAgg[0]?.total ?? 0
  const gastos = gastosAgg[0]?.total ?? 0
  const saldo = ingresos - gastos

  const month = new Intl.DateTimeFormat('es-CO', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(now)

  return {
    month: `${month.charAt(0).toUpperCase()}${month.slice(1)}`,
    ingresos,
    gastos,
    saldo
  }
})

function getMonthStartUTC(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
}

function getNextMonthStartUTC(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1))
}
