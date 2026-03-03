import { useCalendarDateInput } from '../forms/useCalendarDateInput'
import { useMoneyInput } from '../forms/useMoneyInput'
import type { ComputedRef } from 'vue'
import type { Prestamo } from './types'
import { getRequestError } from './helpers'

export function usePrestamoAbonos(prestamos: ComputedRef<Prestamo[]>, refresh: () => Promise<void>) {
  const openAbonoPrestamoId = ref<string | null>(null)
  const abonoForm = reactive({
    amount: 0,
    note: ''
  })
  const { dateValue: abonoDateValue } = useCalendarDateInput()
  const { amountInput: abonoAmountInput } = useMoneyInput(toRef(abonoForm, 'amount'))
  const abonoSaving = ref(false)
  const abonoError = ref('')
  const abonoSuccess = ref('')

  const resetAbonoForm = () => {
    abonoForm.amount = 0
    abonoForm.note = ''
  }

  const toggleAbonoForm = (prestamoId: string) => {
    abonoError.value = ''
    abonoSuccess.value = ''
    if (openAbonoPrestamoId.value === prestamoId) {
      openAbonoPrestamoId.value = null
      resetAbonoForm()
      return
    }
    openAbonoPrestamoId.value = prestamoId
    resetAbonoForm()
  }

  const submitAbono = async () => {
    abonoError.value = ''
    abonoSuccess.value = ''

    const prestamoId = openAbonoPrestamoId.value
    if (!prestamoId) {
      abonoError.value = 'Selecciona un prestamo.'
      return
    }

    const selected = prestamos.value.find(prestamo => prestamo._id === prestamoId)
    if (!selected) {
      abonoError.value = 'Prestamo no encontrado.'
      return
    }

    const amount = Number(abonoForm.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      abonoError.value = 'Agrega un monto valido para el abono.'
      return
    }

    if (amount > selected.pendingAmount) {
      abonoError.value = 'El abono no puede superar el saldo pendiente.'
      return
    }

    abonoSaving.value = true
    try {
      const date = abonoDateValue.value ? abonoDateValue.value.toString() : undefined
      await $fetch(`/api/prestamos/${prestamoId}/abonos`, {
        method: 'POST',
        body: {
          amount,
          date,
          note: abonoForm.note.trim()
        }
      })

      await refresh()
      abonoSuccess.value = 'Abono registrado.'
      resetAbonoForm()

      const updated = prestamos.value.find(prestamo => prestamo._id === prestamoId)
      if (!updated?.pendingAmount) {
        openAbonoPrestamoId.value = null
      }
    } catch (error) {
      abonoError.value = getRequestError(error, 'No se pudo registrar el abono.')
    } finally {
      abonoSaving.value = false
    }
  }

  const closeAbonoFor = (prestamoId: string) => {
    if (openAbonoPrestamoId.value !== prestamoId) {
      return
    }
    openAbonoPrestamoId.value = null
    resetAbonoForm()
  }

  return {
    openAbonoPrestamoId,
    abonoForm,
    abonoAmountInput,
    abonoDateValue,
    abonoSaving,
    abonoError,
    abonoSuccess,
    toggleAbonoForm,
    submitAbono,
    closeAbonoFor
  }
}
