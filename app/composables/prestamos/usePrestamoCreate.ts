import { useCalendarDateInput } from '../forms/useCalendarDateInput'
import { useMoneyInput } from '../forms/useMoneyInput'
import type { PaymentPlan } from './types'
import { getRequestError } from './helpers'
import { useToast } from '#imports'

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
  const toast = useToast()

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
      toast.add({
        title: 'Faltan datos',
        description: 'Agrega el nombre de la persona.',
        icon: 'lucide:alert-circle',
        color: 'error'
      })
      return
    }

    const amount = Number(form.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.add({
        title: 'Faltan datos',
        description: 'Agrega un monto válido.',
        icon: 'lucide:alert-circle',
        color: 'error'
      })
      return
    }

    const installmentsCount = Number(form.installmentsCount)
    if (form.paymentPlan === 'installments' && (!Number.isFinite(installmentsCount) || installmentsCount < 2)) {
      toast.add({
        title: 'Faltan datos',
        description: 'Si el pago es en cuotas, agrega al menos 2 cuotas.',
        icon: 'lucide:alert-circle',
        color: 'error'
      })
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
      toast.add({
        title: 'Préstamo registrado',
        description: 'El préstamo fue guardado exitosamente.',
        icon: 'lucide:check-circle',
        color: 'success'
      })
      resetCreateForm()
    } catch (error) {
      const msg = getRequestError(error, 'No se pudo guardar el préstamo.')
      toast.add({
        title: 'Fondos insuficientes o error',
        description: msg,
        icon: 'lucide:alert-triangle',
        color: 'error'
      })
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
