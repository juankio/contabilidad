import { useProfile } from './useProfile'

type Estadisticas = {
  resumen: {
    month: string
    ingresos: number
    gastos: number
    saldo: number
    saldoDisponible: number
  }
  categorias: Array<{
    category: string
    total: number
  }>
  series: Array<{
    month: string
    ingresos: number
    gastos: number
  }>
}

export const useEstadisticas = () => {
  const { profiles, activeProfileId } = useProfile()
  const selectedProfileId = ref<string>('active') // El por defecto es el "Perfil actual" para la app.

  watch(
    activeProfileId,
    (value) => {
      if (!value) return
      if (selectedProfileId.value === 'active' || selectedProfileId.value === 'all' || !profiles.value.some(p => p._id === selectedProfileId.value)) {
        // Mantenemos el selected de forma coherente si cambian de perfil
      }
    },
    { immediate: true }
  )

  const profileFilterItems = computed(() => [
    { label: 'Perfil actual', value: 'active' },
    { label: 'Todos combinados', value: 'all' },
    ...profiles.value.map(profile => ({ label: profile.name, value: profile._id }))
  ])

  const triggerRefresh = useState('trigger-refresh-estadisticas', () => 0)

  const { data, pending, error, refresh } = useFetch<Estadisticas>('/api/estadisticas', {
    query: { profileId: selectedProfileId },
    key: `stats-${selectedProfileId.value}`,
    lazy: true
  })

  watch(triggerRefresh, () => {
    refresh()
  })

  const categoriasSegments = computed(() => {
    const categorias = data.value?.categorias ?? []
    const palette = ['#0ea5e9', '#10b981', '#f59e0b', '#f97316', '#ef4444', '#8b5cf6']
    return categorias.map((categoria, index) => ({
      label: categoria.category,
      value: categoria.total,
      color: palette[index % palette.length] ?? '#0ea5e9'
    }))
  })

  const ingresosRatio = computed(() => {
    const resumen = data.value?.resumen
    if (!resumen) return 0
    const ingresos = resumen.ingresos ?? 0
    const gastos = resumen.gastos ?? 0
    const total = ingresos + gastos
    if (!total) {
      return 0
    }
    return Math.round((ingresos / total) * 100)
  })

  const gastosRatio = computed(() => {
    const resumen = data.value?.resumen
    if (!resumen) return 0
    if (!ingresosRatio.value && !(resumen.gastos ?? 0)) {
      return 0
    }
    return Math.max(0, 100 - ingresosRatio.value)
  })

  const maxCategoryValue = computed(() => {
    const values = categoriasSegments.value.map(categoria => categoria.value)
    return Math.max(1, ...values)
  })

  const maxSeriesValue = computed(() => {
    const series = data.value?.series ?? []
    return Math.max(1, ...series.map(row => Math.max(row.ingresos, row.gastos)))
  })

  return {
    selectedProfileId,
    profileFilterItems,
    data,
    pending,
    error,
    categoriasSegments,
    ingresosRatio,
    gastosRatio,
    maxCategoryValue,
    maxSeriesValue,
    refresh
  }
}
