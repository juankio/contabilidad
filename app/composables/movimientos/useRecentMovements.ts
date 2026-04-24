import { useFetch } from '#imports'
import { useMovementCrud, type MovimientoRow } from './useMovementCrud'
import { useFormatters } from '../useFormatters'

export function useRecentMovements() {
  const { data: movimientos, pending, error, refresh: refreshMovimientos } = useFetch<MovimientoRow[]>('/api/movimientos', {
    key: 'movimientos',
    query: { limit: 50 },
    lazy: true
  })

  const { formatCurrency, formatShortDate } = useFormatters()
  const showAllModal = ref(false)
  const previewMovimientos = computed(() => (movimientos.value ?? []).slice(0, 3))

  const crud = useMovementCrud(async () => {
    await refreshMovimientos()
  })

  return {
    movimientos,
    pending,
    error,
    showAllModal,
    previewMovimientos,
    formatCurrency,
    formatShortDate,
    ...crud
  }
}
