import { useProfile } from './useProfile'

type Estadisticas = {
  resumen: {
    month: string
    ingresos: number
    gastos: number
    saldo: number
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
  const selectedProfileId = ref<string>('all')

  watch(
    activeProfileId,
    (value) => {
      if (!value) {
        return
      }
      if (selectedProfileId.value === 'all') {
        return
      }
      const exists = profiles.value.some(profile => profile._id === selectedProfileId.value)
      if (!exists) {
        selectedProfileId.value = value
      }
    },
    { immediate: true }
  )

  const profileFilterItems = computed(() => [
    { label: 'Todos', value: 'all' },
    ...profiles.value.map(profile => ({ label: profile.name, value: profile._id }))
  ])

  const { data, pending, error } = useFetch<Estadisticas>('/api/estadisticas', {
    key: 'estadisticas',
    query: computed(() =>
      selectedProfileId.value === 'all'
        ? { scope: 'all' }
        : { profileId: selectedProfileId.value }
    )
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
    const ingresos = data.value?.resumen.ingresos ?? 0
    const gastos = data.value?.resumen.gastos ?? 0
    const total = ingresos + gastos
    if (!total) {
      return 0
    }
    return Math.round((ingresos / total) * 100)
  })

  const gastosRatio = computed(() => {
    if (!ingresosRatio.value && !(data.value?.resumen.gastos ?? 0)) {
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
    maxSeriesValue
  }
}
