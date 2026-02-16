type Gasto = {
  _id: string
  description: string
  category: string
  amount: number
  date: string
}

type ProfileGastosGroup = {
  profileId: string
  profileName: string
  avatarColor: string
  total: number
  gastos: Gasto[]
}

export const useGastos = () => {
  const { data: gastos, pending, error, refresh } = useFetch<Gasto[]>('/api/gastos', {
    key: 'gastos'
  })
  const {
    data: groupedByProfile,
    pending: groupedPending,
    error: groupedError,
    refresh: refreshGrouped
  } = useFetch<ProfileGastosGroup[]>('/api/gastos/grouped', {
    key: 'gastos-grouped'
  })

  const exporting = ref(false)
  const exportError = ref('')
  const { formatCurrency, formatShortDate } = useFormatters()

  const exportGastos = async () => {
    exporting.value = true
    exportError.value = ''
    try {
      const response = await fetch('/api/gastos/export')
      if (!response.ok) {
        throw new Error('Export failed')
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `gastos-${new Date().toISOString().slice(0, 10)}.xlsx`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
    } catch {
      exportError.value = 'No se pudo exportar a Excel.'
    } finally {
      exporting.value = false
    }
  }

  const handleGastoSaved = async () => {
    await refresh()
    await refreshGrouped()
    await refreshNuxtData('estadisticas')
  }

  return {
    gastos,
    groupedByProfile,
    groupedPending,
    groupedError,
    pending,
    error,
    exporting,
    exportError,
    exportGastos,
    handleGastoSaved,
    formatCurrency,
    formatShortDate
  }
}
