import { defineApiHandler } from '../../utils/handler'

import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import { PrestamoModel } from '../../models/prestamo'
import { toIsoDate } from '../../utils/date'

type PrestamoResponse = {
  _id: string
  borrower: string
  description: string
  amount: number
  paidAmount: number
  pendingAmount: number
  status: 'Pendiente' | 'Pagado'
  date: string
  paymentPlan: 'single' | 'installments'
  installmentsCount: number | null
  collectionDate: string | null
  note: string
  abonos: Array<{
    _id: string
    amount: number
    date: string
    note: string
  }>
}

export default defineApiHandler(async (event) => {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)
  const prestamos = await PrestamoModel.find({ profileId }).sort({ date: -1, _id: -1 }).limit(200).lean()

  const mapped: PrestamoResponse[] = prestamos.map((prestamo) => {
    const amount = Number(prestamo.amount ?? 0)
    const paidAmount = Number(prestamo.paidAmount ?? 0)
    const pendingAmount = Math.max(0, amount - paidAmount)
    const abonos = [...(prestamo.abonos ?? [])]
      .sort((a, b) => getTime(b.date) - getTime(a.date))
      .map(abono => ({
        _id: abono._id.toString(),
        amount: Number(abono.amount ?? 0),
        date: toIsoDate(abono.date),
        note: abono.note ?? ''
      }))

    return {
      _id: prestamo._id.toString(),
      borrower: prestamo.borrower ?? '',
      description: prestamo.description ?? '',
      amount,
      paidAmount,
      pendingAmount,
      status: pendingAmount > 0 ? 'Pendiente' : 'Pagado',
      date: toIsoDate(prestamo.date),
      paymentPlan: prestamo.paymentPlan === 'installments' ? 'installments' : 'single',
      installmentsCount: prestamo.installmentsCount ? Number(prestamo.installmentsCount) : null,
      collectionDate: prestamo.collectionDate ? toIsoDate(prestamo.collectionDate) : null,
      note: prestamo.note ?? '',
      abonos
    }
  })

  const summary = mapped.reduce(
    (acc, prestamo) => ({
      totalPrestado: acc.totalPrestado + prestamo.amount,
      totalAbonado: acc.totalAbonado + prestamo.paidAmount,
      totalPendiente: acc.totalPendiente + prestamo.pendingAmount,
      activos: acc.activos + (prestamo.pendingAmount > 0 ? 1 : 0),
      cerrados: acc.cerrados + (prestamo.pendingAmount > 0 ? 0 : 1)
    }),
    {
      totalPrestado: 0,
      totalAbonado: 0,
      totalPendiente: 0,
      activos: 0,
      cerrados: 0
    }
  )

  return {
    summary,
    prestamos: mapped
  }
})

function getTime(value: unknown) {
  const parsed = new Date(value as string | number | Date)
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime()
}
