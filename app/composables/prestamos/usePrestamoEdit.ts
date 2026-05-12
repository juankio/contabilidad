import { ref } from 'vue'
import type { Prestamo } from './types'

export function usePrestamoEdit(refreshList: () => Promise<void>) {
  const isEditing = ref(false)
  const editError = ref<string | null>(null)
  const editSuccess = ref<string | null>(null)

  const editingTarget = ref<Prestamo | null>(null)

  const editForm = ref({
    borrower: '',
    description: '',
    amountInput: '',
    dateValue: null as Date | null,
    collectionDateValue: null as Date | null,
    note: ''
  })

  function startEditing(prestamo: Prestamo) {
    editingTarget.value = prestamo
    editForm.value = {
      borrower: prestamo.borrower,
      description: prestamo.description || '',
      amountInput: String(prestamo.amount),
      dateValue: new Date(prestamo.date),
      collectionDateValue: prestamo.collectionDate ? new Date(prestamo.collectionDate) : null,
      note: prestamo.note || ''
    }
    editError.value = null
    editSuccess.value = null
  }

  function cancelEditing() {
    editingTarget.value = null
    editError.value = null
  }

  async function submitEdit() {
    if (!editingTarget.value) return

    isEditing.value = true
    editError.value = null
    editSuccess.value = null

    try {
      await $fetch(`/api/prestamos/${editingTarget.value._id}`, {
        method: 'PATCH',
        body: {
          borrower: editForm.value.borrower,
          description: editForm.value.description,
          amount: Number(editForm.value.amountInput),
          date: editForm.value.dateValue?.toISOString(),
          collectionDate: editForm.value.collectionDateValue?.toISOString() || null,
          note: editForm.value.note
        }
      })

      editSuccess.value = 'Préstamo actualizado exitosamente'
      editingTarget.value = null
      await refreshList()
    } catch (e: unknown) {
      const errorObj = e as { data?: { statusMessage?: string } }
      editError.value = errorObj.data?.statusMessage || 'Error al editar el préstamo'
    } finally {
      isEditing.value = false
    }
  }

  return {
    isEditing,
    editError,
    editSuccess,
    editingTarget,
    editForm,
    startEditing,
    cancelEditing,
    submitEdit
  }
}
