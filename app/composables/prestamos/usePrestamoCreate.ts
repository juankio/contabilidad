import { useCalendarDateInput } from '../forms/useCalendarDateInput'
import { useMoneyInput } from '../forms/useMoneyInput'
import type { PaymentPlan } from './types'
import { getRequestError } from './helpers'

export function usePrestamoCreate(refresh: () => Promise<void>) {
  const form = reactive({
    borrower: '',
    description: '',
    paymentPlan: 'single' as PaymentPlan,
    installmentsCount: 0,
    amount: 0,
    note: ''
  })

  const { dateValue: loanDateValue } = useCalendarDateInput()
  const collectionDateValue = shallowRef<unknown>(null)
  const { amountInput } = useMoneyInput(toRef(form, 'amount'))
  const installmentsInput = computed({
    get() {
      return form.installmentsCount ? String(form.installmentsCount) : ''
    },
    set(value: string) {
      const numeric = Number(value.replace(/[^\d]/g, ''))
      form.installmentsCount = Number.isFinite(numeric) ? numeric : 0
    }
  })

  const creating = ref(false)
  const createError = ref('')
  const createSuccess = ref('')

  watch(
    () => form.paymentPlan,
    (nextPlan) => {
      if (nextPlan !== 'installments') {
        form.installmentsCount = 0
      }
    }
  )

  const resetCreateForm = () => {
    form.borrower = ''
    form.description = ''
    form.paymentPlan = 'single'
    form.installmentsCount = 0
    form.amount = 0
    form.note = ''
    collectionDateValue.value = null
  }

  const submitPrestamo = async () => {
    createError.value = ''
    createSuccess.value = ''

    if (!form.borrower.trim()) {
      createError.value = 'Agrega el nombre de la persona.'
      return
    }

    const amount = Number(form.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      createError.value = 'Agrega un monto valido.'
      return
    }

    const installmentsCount = Number(form.installmentsCount)
    if (form.paymentPlan === 'installments' && (!Number.isFinite(installmentsCount) || installmentsCount < 2)) {
      createError.value = 'Si el pago es en cuotas, agrega al menos 2 cuotas.'
      return
    }

    creating.value = true
    try {
      const date = loanDateValue.value ? loanDateValue.value.toString() : undefined
      const collectionDate = collectionDateValue.value
        ? (collectionDateValue.value as { toString: () => string }).toString()
        : undefined

      await $fetch('/api/prestamos', {
        method: 'POST',
        body: {
          borrower: form.borrower.trim(),
          description: form.description.trim(),
          paymentPlan: form.paymentPlan,
          installmentsCount: form.paymentPlan === 'installments' ? installmentsCount : undefined,
          amount,
          date,
          collectionDate,
          note: form.note.trim()
        }
      })

      await refresh()
      createSuccess.value = 'Prestamo guardado.'
      resetCreateForm()
    } catch (error) {
      createError.value = getRequestError(error, 'No se pudo guardar el prestamo.')
    } finally {
      creating.value = false
    }
  }

  return {
    form,
    amountInput,
    installmentsInput,
    loanDateValue,
    collectionDateValue,
    creating,
    createError,
    createSuccess,
    submitPrestamo
  }
}
