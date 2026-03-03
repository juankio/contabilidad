export type PaymentPlan = 'single' | 'installments'

export type PrestamoAbono = {
  _id: string
  amount: number
  date: string
  note: string
}

export type Prestamo = {
  _id: string
  borrower: string
  description: string
  amount: number
  paidAmount: number
  pendingAmount: number
  status: 'Pendiente' | 'Pagado'
  date: string
  paymentPlan: PaymentPlan
  installmentsCount: number | null
  collectionDate: string | null
  note: string
  abonos: PrestamoAbono[]
}

export type PrestamosSummary = {
  totalPrestado: number
  totalAbonado: number
  totalPendiente: number
  activos: number
  cerrados: number
}

export type PrestamosResponse = {
  summary: PrestamosSummary
  prestamos: Prestamo[]
}
