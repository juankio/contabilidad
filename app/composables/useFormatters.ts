export const useFormatters = () => {
  const monthsShort = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(value)

  const formatShortDate = (value: string) => {
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
      return '--'
    }

    const day = String(parsed.getUTCDate()).padStart(2, '0')
    const month = monthsShort[parsed.getUTCMonth()] ?? '--'
    return `${day}-${month}`
  }

  return { formatCurrency, formatShortDate }
}
