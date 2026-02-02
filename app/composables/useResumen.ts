type Resumen = {
  month: string
  ingresos: number
  gastos: number
  saldo: number
}

export const useResumen = async () => {
  const { data: resumen, pending, error } = await useFetch<Resumen>('/api/resumen', {
    key: 'resumen'
  })

  const exporting = ref(false)

  const exportResumen = async () => {
    exporting.value = true
    try {
      const response = await fetch('/api/resumen/export')
      if (!response.ok) {
        throw new Error('Export failed')
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `resumen-${new Date().toISOString().slice(0, 10)}.xlsx`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
    } finally {
      exporting.value = false
    }
  }

  const { formatCurrency } = useFormatters()

  return { resumen, pending, error, exporting, exportResumen, formatCurrency }
}
