import { useCalendarDateInput } from './useCalendarDateInput'
import { useMoneyInput } from './useMoneyInput'

export function useMovementForm() {
  const form = reactive({
    type: 'Gasto',
    amount: 0,
    category: '',
    note: ''
  })
  const newCategoryInput = ref('')
  const isSaving = ref(false)
  const formError = ref('')
  const formSuccess = ref('')

  const { dateValue } = useCalendarDateInput()
  const { amountInput } = useMoneyInput(toRef(form, 'amount'))

  const {
    activeExpenseCategories,
    activeIncomeCategories,
    refreshProfileCatalog
  } = useProfile()

  const expenseCategories = computed(() => activeExpenseCategories.value)
  const incomeCategories = computed(() => activeIncomeCategories.value)

  const categories = computed(() =>
    form.type === 'Ingreso' ? incomeCategories.value : expenseCategories.value
  )

  const normalizeCategory = (value: string) => value.trim().slice(0, 40)
  const selectedCategory = computed(() => {
    const custom = normalizeCategory(newCategoryInput.value)
    return custom || form.category
  })

  watch(
    [() => form.type, incomeCategories, expenseCategories],
    ([nextType, nextIncomeCategories, nextExpenseCategories]) => {
      const list = nextType === 'Ingreso' ? nextIncomeCategories : nextExpenseCategories
      if (!list.includes(form.category)) {
        form.category = list[0] ?? ''
      }
    },
    { immediate: true }
  )

  const submitMovement = async () => {
    formError.value = ''
    formSuccess.value = ''

    if (!form.note.trim()) {
      formError.value = 'Agrega una nota o descripcion.'
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
      const endpoint = form.type === 'Ingreso' ? '/api/ingresos' : '/api/gastos'
      const date = dateValue.value ? dateValue.value.toString() : undefined
      await $fetch(endpoint, {
        method: 'POST',
        body: {
          description: form.note.trim(),
          category: selectedCategory.value,
          amount,
          date
        }
      })
      await refreshProfileCatalog()
      await refreshNuxtData(['resumen', 'movimientos', 'categorias'])
      formSuccess.value = `${form.type} guardado.`
      form.amount = 0
      form.note = ''
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
    formSuccess,
    submitMovement
  }
}
