import { defineEventHandler, getQuery } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { GastoModel } from '../../models/gasto'
import { IngresoModel } from '../../models/ingreso'
import { compareByDateDescWithId, toIsoDate } from '../../utils/date'

type Movimiento = {
  _id: string
  type: 'Gasto' | 'Ingreso'
  description: string
  category: string
  amount: number
  date: string
}

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)
  const query = getQuery(event)
  const limit = Number(query.limit ?? 8)
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 20) : 8

  const [gastos, ingresos] = await Promise.all([
    GastoModel.find({ profileId }).sort({ date: -1, _id: -1 }).limit(safeLimit * 2).lean(),
    IngresoModel.find({ profileId }).sort({ date: -1, _id: -1 }).limit(safeLimit * 2).lean()
  ])

  const movimientos: Movimiento[] = [
    ...gastos.map(gasto => ({
      _id: gasto._id.toString(),
      type: 'Gasto' as const,
      description: gasto.description ?? '',
      category: gasto.category ?? '',
      amount: Number(gasto.amount ?? 0),
      date: toIsoDate(gasto.date)
    })),
    ...ingresos.map(ingreso => ({
      _id: ingreso._id.toString(),
      type: 'Ingreso' as const,
      description: ingreso.description ?? '',
      category: ingreso.category ?? '',
      amount: Number(ingreso.amount ?? 0),
      date: toIsoDate(ingreso.date)
    }))
  ]

  movimientos.sort(compareByDateDescWithId)

  return movimientos.slice(0, safeLimit)
})
