export const useMoneyInput = (amount: Ref<number>) => {
  const formatAmount = (value: number) =>
    new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)

  const parseAmountInput = (value: string) => {
    const numeric = value.replace(/[^\d]/g, '')
    return numeric ? Number(numeric) : 0
  }

  const amountInput = computed({
    get() {
      return amount.value ? formatAmount(amount.value) : ''
    },
    set(value: string) {
      amount.value = parseAmountInput(value)
    }
  })

  return { amountInput }
}
