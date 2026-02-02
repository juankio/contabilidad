type Gasto = {
  _id: string
  description: string
  category: string
  amount: number
  date: string
}

export const useGastos = async () => {
  const { data: gastos, pending, error, refresh } = await useFetch<Gasto[]>('/api/gastos', {
    key: 'gastos'
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
    await refreshNuxtData('estadisticas')
  }

  return {
    gastos,
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
