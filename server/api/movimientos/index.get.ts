import { defineEventHandler, getQuery } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { GastoModel } from '../../models/gasto'
import { IngresoModel } from '../../models/ingreso'

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
  const query = getQuery(event)
  const limit = Number(query.limit ?? 8)
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 20) : 8

  const [gastos, ingresos] = await Promise.all([
    GastoModel.find().sort({ date: -1 }).limit(safeLimit * 2).lean(),
    IngresoModel.find().sort({ date: -1 }).limit(safeLimit * 2).lean()
  ])

  const movimientos: Movimiento[] = [
    ...gastos.map(gasto => ({
      _id: gasto._id.toString(),
      type: 'Gasto' as const,
      description: gasto.description ?? '',
      category: gasto.category ?? '',
      amount: Number(gasto.amount ?? 0),
      date: gasto.date instanceof Date ? gasto.date.toISOString() : new Date().toISOString()
    })),
    ...ingresos.map(ingreso => ({
      _id: ingreso._id.toString(),
      type: 'Ingreso' as const,
      description: ingreso.description ?? '',
      category: ingreso.category ?? '',
      amount: Number(ingreso.amount ?? 0),
      date: ingreso.date instanceof Date ? ingreso.date.toISOString() : new Date().toISOString()
    }))
  ]

  movimientos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return movimientos.slice(0, safeLimit)
})
