export const useFormatters = () => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(value)

  const formatShortDate = (value: string) =>
    new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'short'
    }).format(new Date(value))

  return { formatCurrency, formatShortDate }
}
