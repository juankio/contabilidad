import { getRequestError } from '../prestamos/helpers'

export function useGranjaCerdos() {
  const lotes = ref<any[]>([])
  const loading = ref(false)

  const fetchLotes = async () => {
    loading.value = true
    try {
      lotes.value = await $fetch('/api/granja/lotes')
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const crearLote = async (payload: any) => {
    try {
      await $fetch('/api/granja/lotes', { method: 'POST', body: payload })
      await fetchLotes()
    } catch (error) {
      throw new Error(getRequestError(error, 'No se pudo crear el lote'))
    }
  }

  const comprarConcentrado = async (payload: any) => {
    try {
      await $fetch('/api/granja/concentrado', { method: 'POST', body: payload })
    } catch (error) {
      throw new Error(getRequestError(error, 'No se pudo comprar el concentrado'))
    }
  }

  const editarLote = async (id: string, data: { nombreLoteMadre: string }) => {
    try {
      await $fetch(`/api/granja/lotes/${id}`, { method: 'PUT', body: data })
      await fetchLotes()
    } catch (error) {
      throw new Error(getRequestError(error, 'No se pudo editar el lote'))
    }
  }

  const eliminarLote = async (id: string) => {
    try {
      await $fetch(`/api/granja/lotes/${id}`, { method: 'DELETE' })
      await fetchLotes()
    } catch (error) {
      throw new Error(getRequestError(error, 'No se pudo eliminar el lote'))
    }
  }

  return { lotes, loading, fetchLotes, crearLote, comprarConcentrado, editarLote, eliminarLote }
}
