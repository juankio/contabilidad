import mongoose from 'mongoose'
import { IngresoModel } from '../models/ingreso'
import { GastoModel } from '../models/gasto'
import { PrestamoModel } from '../models/prestamo'
import { PagoTrabajadorModel } from '../models/pago-trabajador'
import { CompraConcentradoModel } from '../models/compra-concentrado'
import { PostreVentaModel } from '../models/postre-venta'

export async function getAvailableBalance(profileMatch: string | mongoose.Types.ObjectId | { $in: mongoose.Types.ObjectId[] }): Promise<number> {
  const match = typeof profileMatch === 'string' 
    ? new mongoose.Types.ObjectId(profileMatch) 
    : profileMatch

  // 1. Suma de ingresos normales
  const ingresosRes = await IngresoModel.aggregate([
    { $match: { profileId: match } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ])
  const totalIngresos = ingresosRes[0]?.total ?? 0

  // 2. Suma de gastos normales
  const gastosRes = await GastoModel.aggregate([
    { $match: { profileId: match } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ])
  const totalGastos = gastosRes[0]?.total ?? 0

  // 3. Préstamos otorgados (Salida de dinero) y Abonos recibidos (Entrada de dinero)
  const prestamosRes = await PrestamoModel.aggregate([
    { $match: { profileId: match } },
    { $group: {
      _id: null,
      totalPrestado: { $sum: '$amount' },
      totalAbonado: { $sum: '$paidAmount' }
    } }
  ])
  const totalPrestado = prestamosRes[0]?.totalPrestado ?? 0
  const totalAbonado = prestamosRes[0]?.totalAbonado ?? 0

  // 4. Pagos a trabajadores (Salida de dinero)
  const pagosTrabajadoresRes = await PagoTrabajadorModel.aggregate([
    { $match: { profileId: match } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ])
  const totalPagosTrabajadores = pagosTrabajadoresRes[0]?.total ?? 0

  // 5. Compras de concentrado (Salida de dinero)
  const comprasConcentradoRes = await CompraConcentradoModel.aggregate([
    { $match: { profileId: match } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ])
  const totalComprasConcentrado = comprasConcentradoRes[0]?.total ?? 0

  // 6. Ventas de postres (Entrada de dinero)
  const ventasPostresRes = await PostreVentaModel.aggregate([
    { $match: { profileId: match } },
    { $lookup: { from: 'postres', localField: 'postreId', foreignField: '_id', as: 'postre' } },
    { $unwind: '$postre' },
    { $group: { _id: null, total: { $sum: { $multiply: ['$qty', '$postre.price'] } } } }
  ])
  const totalVentasPostres = ventasPostresRes[0]?.total ?? 0

  // BALANCE REAL = (Entradas) - (Salidas)
  const entradas = totalIngresos + totalAbonado + totalVentasPostres
  const salidas = totalGastos + totalPrestado + totalPagosTrabajadores + totalComprasConcentrado

  return entradas - salidas
}
