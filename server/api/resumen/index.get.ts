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

  const [ingresos, gastos, ingresosDisponibles, gastosDisponibles] = await Promise.all([
    aggregateTotal(IngresoModel, profileObjectId, { $gte: start, $lt: end }),
    aggregateTotal(GastoModel, profileObjectId, { $gte: start, $lt: end }),
    aggregateTotal(IngresoModel, profileObjectId, { $lt: end }),
    aggregateTotal(GastoModel, profileObjectId, { $lt: end })
  ])

  const saldo = ingresos - gastos
  const saldoDisponible = ingresosDisponibles - gastosDisponibles

  const month = new Intl.DateTimeFormat('es-CO', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(now)

  return {
    month: `${month.charAt(0).toUpperCase()}${month.slice(1)}`,
    ingresos,
    gastos,
    saldo,
    saldoDisponible
  }
})

function getMonthStartUTC(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
}

function getNextMonthStartUTC(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1))
}

async function aggregateTotal(
  model: typeof GastoModel | typeof IngresoModel,
  profileId: mongoose.Types.ObjectId,
  dateRange: { $gte?: Date, $lt?: Date }
) {
  const rows = await model.aggregate<{ total: number }>([
    { $match: { profileId, date: dateRange } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ])

  return Number(rows[0]?.total ?? 0)
}
