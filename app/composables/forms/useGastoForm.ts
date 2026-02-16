import { useCalendarDateInput } from './useCalendarDateInput'
import { useMoneyInput } from './useMoneyInput'

export function useGastoForm(onSaved: () => void | Promise<void>) {
  const form = reactive({
    description: '',
    category: '',
    amount: 0
  })
  const newCategoryInput = ref('')
  const isSaving = ref(false)
  const formError = ref('')

  const { dateValue } = useCalendarDateInput()
  const { amountInput } = useMoneyInput(toRef(form, 'amount'))
  const { activeExpenseCategories, refreshProfileCatalog } = useProfile()

  const categories = computed(() => activeExpenseCategories.value)

  const normalizeCategory = (value: string) => value.trim().slice(0, 40)
  const selectedCategory = computed(() => {
    const custom = normalizeCategory(newCategoryInput.value)
    return custom || form.category
  })

  watch(
    categories,
    (nextCategories) => {
      if (!nextCategories.includes(form.category)) {
        form.category = nextCategories[0] ?? ''
      }
    },
    { immediate: true }
  )

  const submitGasto = async () => {
    formError.value = ''

    if (!form.description.trim()) {
      formError.value = 'Agrega una descripcion.'
      return
    }

    const amount = Number(form.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      formError.value = 'Agrega un monto valido.'
      return
    }

    if (!selectedCategory.value.trim()) {
      formError.value = 'Selecciona o escribe una categoria.'
      return
    }

    isSaving.value = true

    try {
      const date = dateValue.value ? dateValue.value.toString() : undefined
      await $fetch('/api/gastos', {
        method: 'POST',
        body: {
          description: form.description.trim(),
          category: selectedCategory.value,
          amount,
          date
        }
      })
      await refreshProfileCatalog()
      await onSaved()
      form.description = ''
      form.amount = 0
      newCategoryInput.value = ''
    } catch {
      formError.value = 'No se pudo guardar el gasto.'
    } finally {
      isSaving.value = false
    }
  }

  onMounted(async () => {
    await refreshProfileCatalog()
  })

  return {
    form,
    categories,
    newCategoryInput,
    dateValue,
    amountInput,
    isSaving,
    formError,
    submitGasto
  }
}
