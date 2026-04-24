import mongoose from 'mongoose'
import { IngresoModel } from '../models/ingreso'
import { GastoModel } from '../models/gasto'
import { PrestamoModel } from '../models/prestamo'
import { PagoTrabajadorModel } from '../models/pago-trabajador'
import { CompraConcentradoModel } from '../models/compra-concentrado'
import { PostreVentaModel } from '../models/postre-venta'

export async function getMonthlyStats(
  profileMatch: mongoose.Types.ObjectId | { $in: mongoose.Types.ObjectId[] },
  start: Date,
  end: Date
) {
  const [
    ingresosRes, gastosRes, prestamosGastosRes, abonosRes,
    pagosTrabajadoresRes, comprasConcentradoRes, ventasPostresRes
  ] = await Promise.all([
    IngresoModel.aggregate([
      { $match: { profileId: profileMatch, date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    GastoModel.aggregate([
      { $match: { profileId: profileMatch, date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    PrestamoModel.aggregate([
      { $match: { profileId: profileMatch, date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    PrestamoModel.aggregate([
      { $match: { profileId: profileMatch } },
      { $unwind: '$abonos' },
      { $match: { 'abonos.date': { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: '$abonos.amount' } } }
    ]),
    PagoTrabajadorModel.aggregate([
      { $match: { profileId: profileMatch, date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    CompraConcentradoModel.aggregate([
      { $match: { profileId: profileMatch, date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    PostreVentaModel.aggregate([
      { $match: { profileId: profileMatch, date: { $gte: start, $lt: end } } },
      { $lookup: { from: 'postres', localField: 'postreId', foreignField: '_id', as: 'postre' } },
      { $unwind: '$postre' },
      { $group: { _id: null, total: { $sum: { $multiply: ['$qty', '$postre.price'] } } } }
    ])
  ])

  const totalIngresos = (ingresosRes[0]?.total ?? 0) + (abonosRes[0]?.total ?? 0) + (ventasPostresRes[0]?.total ?? 0)
  const totalGastos = (gastosRes[0]?.total ?? 0) + (prestamosGastosRes[0]?.total ?? 0) + (pagosTrabajadoresRes[0]?.total ?? 0) + (comprasConcentradoRes[0]?.total ?? 0)

  return { 
    ingresos: totalIngresos, 
    gastos: totalGastos,
    breakdown: {
      gastosNormales: gastosRes[0]?.total ?? 0,
      prestamosOtorgados: prestamosGastosRes[0]?.total ?? 0,
      pagosNómina: pagosTrabajadoresRes[0]?.total ?? 0,
      comprasConcentrado: comprasConcentradoRes[0]?.total ?? 0
    }
  }
}

export async function getCategoriesWithOtherModules(
  profileMatch: mongoose.Types.ObjectId | { $in: mongoose.Types.ObjectId[] },
  start: Date,
  end: Date
) {
  // Categorias normales de gastos
  const categoriasNormales = await GastoModel.aggregate([
    { $match: { profileId: profileMatch, date: { $gte: start, $lt: end } } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $project: { _id: 0, category: '$_id', total: 1 } }
  ])

  const { breakdown } = await getMonthlyStats(profileMatch, start, end)

  const allCategories = [...categoriasNormales]

  if (breakdown.prestamosOtorgados > 0) {
    allCategories.push({ category: 'Préstamos Otorgados', total: breakdown.prestamosOtorgados })
  }
  if (breakdown.pagosNómina > 0) {
    allCategories.push({ category: 'Nómina / Trabajadores', total: breakdown.pagosNómina })
  }
  if (breakdown.comprasConcentrado > 0) {
    allCategories.push({ category: 'Concentrado Animales', total: breakdown.comprasConcentrado })
  }

  // Ordenar de mayor a menor y tomar los primeros 6
  return allCategories.sort((a, b) => b.total - a.total).slice(0, 6)
}

type MonthKey = { year: number, month: number }

export async function getSeriesWithOtherModules(
  profileMatch: mongoose.Types.ObjectId | { $in: mongoose.Types.ObjectId[] },
  monthsKeys: MonthKey[]
) {
  const map: Record<string, { ingresos: number, gastos: number }> = {}
  
  monthsKeys.forEach(m => {
    map[`${m.year}-${m.month}`] = { ingresos: 0, gastos: 0 }
  })

  // We could just loop over months and call getMonthlyStats for each month
  await Promise.all(monthsKeys.map(async (monthKey) => {
    const start = new Date(Date.UTC(monthKey.year, monthKey.month - 1, 1))
    const end = new Date(Date.UTC(monthKey.year, monthKey.month, 1))
    
    const stats = await getMonthlyStats(profileMatch, start, end)
    map[`${monthKey.year}-${monthKey.month}`] = {
      ingresos: stats.ingresos,
      gastos: stats.gastos
    }
  }))

  return map
}
