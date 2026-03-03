import type { Ref } from 'vue'
import type { Prestamo } from './types'
import { getRequestError } from './helpers'

type DeleteOptions = {
  onDeleted: (prestamo: Prestamo) => void
  createSuccess: Ref<string>
}

export function usePrestamoDelete(refresh: () => Promise<void>, options: DeleteOptions) {
  const deletingPrestamoId = ref('')
  const deletingTarget = ref<Prestamo | null>(null)
  const deleteError = ref('')

  const requestDeletePrestamo = (prestamo: Prestamo) => {
    deleteError.value = ''
    deletingTarget.value = prestamo
  }

  const cancelDeletePrestamo = () => {
    if (deletingPrestamoId.value) {
      return
    }
    deletingTarget.value = null
    deleteError.value = ''
  }

  const confirmDeletePrestamo = async () => {
    const prestamo = deletingTarget.value
    if (!prestamo) {
      return
    }

    deletingPrestamoId.value = prestamo._id
    deleteError.value = ''
    try {
      await $fetch(`/api/prestamos/${prestamo._id}`, { method: 'DELETE' })
      await refresh()
      options.onDeleted(prestamo)
      options.createSuccess.value = 'Prestamo eliminado.'
    } catch (error) {
      deleteError.value = getRequestError(error, 'No se pudo eliminar el prestamo.')
    } finally {
      deletingPrestamoId.value = ''
      if (!deleteError.value) {
        deletingTarget.value = null
      }
    }
  }

  return {
    deletingPrestamoId,
    deletingTarget,
    deleteError,
    requestDeletePrestamo,
    cancelDeletePrestamo,
    confirmDeletePrestamo
  }
}
