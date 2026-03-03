import type { PrestamosResponse } from './types'
import { defaultSummary } from './helpers'

export function usePrestamosData() {
  const { data, pending, error, refresh } = useFetch<PrestamosResponse>('/api/prestamos', {
    key: 'prestamos'
  })

  const { formatCurrency, formatShortDate } = useFormatters()
  const prestamos = computed(() => data.value?.prestamos ?? [])
  const summary = computed(() => data.value?.summary ?? defaultSummary)
  const prestamosPendientes = computed(() => prestamos.value.filter(prestamo => prestamo.pendingAmount > 0))
  const prestamosPagados = computed(() => prestamos.value.filter(prestamo => prestamo.pendingAmount <= 0))

  return {
    data,
    pending,
    error,
    refresh,
    formatCurrency,
    formatShortDate,
    prestamos,
    summary,
    prestamosPendientes,
    prestamosPagados
  }
}
