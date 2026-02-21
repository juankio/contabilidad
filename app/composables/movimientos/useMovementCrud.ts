import { useProfile } from '../useProfile'

export type MovimientoRow = {
  _id: string
  type: 'Gasto' | 'Ingreso'
  description: string
  category: string
  amount: number
  date: string
}

type RequestError = { data?: { statusMessage?: string } }

const REFRESH_KEYS = ['resumen', 'categorias', 'gastos', 'gastos-grouped', 'estadisticas'] as const

const toDateInputValue = (value: string) => {
  if (!value) return ''
  return value.includes('T') ? value.slice(0, 10) : value
}

const formatAmountInput = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)

const parseAmountInput = (value: string) => {
  const numeric = value.replace(/[^\d]/g, '')
  return numeric ? Number(numeric) : 0
}

const getRequestError = (error: unknown, fallback: string) => {
  const message = error instanceof Error ? error.message : ''
  return (error as RequestError)?.data?.statusMessage || message || fallback
}

export function useMovementCrud(refreshMovimientos: () => Promise<void>) {
  const { refreshProfileCatalog } = useProfile()
  const editing = ref<MovimientoRow | null>(null)
  const deleting = ref<MovimientoRow | null>(null)
  const editDescription = ref('')
  const editCategory = ref('')
  const editAmountInput = ref('')
  const editDate = ref('')
  const editLoading = ref(false)
  const deleteLoading = ref(false)
  const editError = ref('')
  const deleteError = ref('')

  const canSubmitEdit = computed(() =>
    editDescription.value.trim().length > 0
    && editCategory.value.trim().length > 0
    && parseAmountInput(editAmountInput.value) > 0
    && Boolean(editDate.value)
  )

  const refreshAll = async () => {
    await Promise.all([refreshMovimientos(), refreshProfileCatalog(), refreshNuxtData([...REFRESH_KEYS])])
  }

  const openEdit = (movement: MovimientoRow) => {
    editing.value = movement
    editDescription.value = movement.description
    editCategory.value = movement.category
    editAmountInput.value = formatAmountInput(movement.amount)
    editDate.value = toDateInputValue(movement.date)
    editError.value = ''
  }

  const closeEdit = () => {
    editing.value = null
    editError.value = ''
  }

  const submitEdit = async () => {
    if (!editing.value || !canSubmitEdit.value) return false
    editLoading.value = true
    editError.value = ''
    try {
      await $fetch(`/api/movimientos/${editing.value._id}`, {
        method: 'PATCH',
        body: {
          type: editing.value.type,
          description: editDescription.value.trim(),
          category: editCategory.value.trim(),
          amount: parseAmountInput(editAmountInput.value),
          date: editDate.value
        }
      })
      await refreshAll()
      closeEdit()
      return true
    } catch (error: unknown) {
      editError.value = getRequestError(error, 'No se pudo actualizar el movimiento.')
      return false
    } finally {
      editLoading.value = false
    }
  }

  const openDelete = (movement: MovimientoRow) => {
    deleting.value = movement
    deleteError.value = ''
  }

  const closeDelete = () => {
    deleting.value = null
    deleteError.value = ''
  }

  const confirmDelete = async () => {
    if (!deleting.value) return false
    deleteLoading.value = true
    deleteError.value = ''
    try {
      await $fetch(`/api/movimientos/${deleting.value._id}`, {
        method: 'DELETE',
        body: { type: deleting.value.type }
      })
      await refreshAll()
      closeDelete()
      return true
    } catch (error: unknown) {
      deleteError.value = getRequestError(error, 'No se pudo eliminar el movimiento.')
      return false
    } finally {
      deleteLoading.value = false
    }
  }

  return {
    editOpen: computed(() => Boolean(editing.value)),
    editType: computed(() => editing.value?.type ?? null),
    editDescription,
    editCategory,
    editAmountInput,
    editDate,
    editLoading,
    editError,
    canSubmitEdit,
    deleteOpen: computed(() => Boolean(deleting.value)),
    deleteType: computed(() => deleting.value?.type ?? null),
    deleteLabel: computed(() => deleting.value?.description ?? ''),
    deleteLoading,
    deleteError,
    openEdit,
    closeEdit,
    submitEdit,
    openDelete,
    closeDelete,
    confirmDelete
  }
}
