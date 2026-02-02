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

export const useEstadisticas = async () => {
  const { data, pending, error } = await useFetch<Estadisticas>('/api/estadisticas', {
    key: 'estadisticas'
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
