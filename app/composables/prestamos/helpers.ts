import type { PaymentPlan, PrestamosSummary } from './types'

type RequestError = { data?: { statusMessage?: string } }

export const defaultSummary: PrestamosSummary = {
  totalPrestado: 0,
  totalAbonado: 0,
  totalPendiente: 0,
  activos: 0,
  cerrados: 0
}

export function getRequestError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : ''
  return (error as RequestError)?.data?.statusMessage || message || fallback
}

export function paymentPlanLabel(paymentPlan: PaymentPlan, installmentsCount: number | null) {
  if (paymentPlan === 'installments') {
    return `${installmentsCount ?? 0} cuotas`
  }
  return 'Pago unico'
}
