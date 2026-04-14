import { defineEventHandler, getQuery } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { GastoModel } from '../../models/gasto'
import { IngresoModel } from '../../models/ingreso'
import { PrestamoModel } from '../../models/prestamo'
import { PagoTrabajadorModel } from '../../models/pago-trabajador'
import { CompraConcentradoModel } from '../../models/compra-concentrado'
import { compareByDateDescWithId, toIsoDate } from '../../utils/date'

type Movimiento = {
  _id: string
  type: 'Gasto' | 'Ingreso' | 'Préstamo' | 'Abono Préstamo' | 'Pago Trabajador' | 'Compra Concentrado'
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
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 40) : 8

  const [gastos, ingresos, prestamos, pagosTrabajadores, comprasConcentrado] = await Promise.all([
    GastoModel.find({ profileId }).sort({ date: -1, _id: -1 }).limit(safeLimit * 2).lean(),
    IngresoModel.find({ profileId }).sort({ date: -1, _id: -1 }).limit(safeLimit * 2).lean(),
    PrestamoModel.find({ profileId }).sort({ date: -1, _id: -1 }).limit(safeLimit * 2).lean(),
    PagoTrabajadorModel.find({ profileId }).sort({ date: -1, _id: -1 }).populate('trabajadorId').limit(safeLimit * 2).lean(),
    CompraConcentradoModel.find({ profileId }).sort({ date: -1, _id: -1 }).limit(safeLimit * 2).lean()
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
    })),
    ...prestamos.map(prestamo => ({
      _id: prestamo._id.toString(),
      type: 'Préstamo' as const,
      description: prestamo.borrower ?? '',
      category: 'Finanzas',
      amount: Number(prestamo.amount ?? 0),
      date: toIsoDate(prestamo.date)
    })),
    // Extraer también los abonos de los préstamos
    ...prestamos.flatMap(prestamo => (prestamo.abonos || []).map(abono => ({
      _id: abono._id.toString(),
      type: 'Abono Préstamo' as const,
      description: prestamo.borrower ?? '',
      category: 'Finanzas',
      amount: Number(abono.amount ?? 0),
      date: toIsoDate(abono.date)
    }))),
    ...pagosTrabajadores.map(pago => ({
      _id: pago._id.toString(),
      type: 'Pago Trabajador' as const,
      description: (pago.trabajadorId as any)?.nombre as string ?? 'Trabajador',
      category: pago.tipo === 'quincena' ? 'Nómina' : 'Adelanto',
      amount: Number(pago.amount ?? 0),
      date: toIsoDate(pago.date)
    })),
    ...comprasConcentrado.map(compra => ({
      _id: compra._id.toString(),
      type: 'Compra Concentrado' as const,
      description: compra.formula ?? '',
      category: 'Granja',
      amount: Number(compra.amount ?? 0),
      date: toIsoDate(compra.date)
    }))
  ]

  movimientos.sort(compareByDateDescWithId)

  return movimientos.slice(0, safeLimit)
})
