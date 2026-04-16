import { getRequestError } from '../prestamos/helpers'

export function useTrabajadores() {
  const trabajadores = ref<any[]>([])
  const loading = ref(false)

  const fetchTrabajadores = async () => {
    loading.value = true
    try {
      trabajadores.value = await $fetch('/api/trabajadores')
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const crearTrabajador = async (payload: any) => {
    try {
      await $fetch('/api/trabajadores', { method: 'POST', body: payload })
      await fetchTrabajadores()
    } catch (error) {
      throw new Error(getRequestError(error, 'No se pudo crear el trabajador'))
    }
  }

  const pagarTrabajador = async (payload: any) => {
    try {
      await $fetch('/api/trabajadores/pagos', { method: 'POST', body: payload })
      await fetchTrabajadores()
    } catch (error) {
      throw new Error(getRequestError(error, 'No se pudo procesar el pago'))
    }
  }

  const editarTrabajador = async (id: string, payload: any) => {
    try {
      await $fetch(`/api/trabajadores/${id}`, { method: 'PUT', body: payload })
      await fetchTrabajadores()
    } catch (error) {
      throw new Error(getRequestError(error, 'No se pudo editar el trabajador'))
    }
  }

  const eliminarTrabajador = async (id: string) => {
    try {
      await $fetch(`/api/trabajadores/${id}`, { method: 'DELETE' })
      await fetchTrabajadores()
    } catch (error) {
      throw new Error(getRequestError(error, 'No se pudo eliminar el trabajador'))
    }
  }

  return { trabajadores, loading, fetchTrabajadores, crearTrabajador, pagarTrabajador, editarTrabajador, eliminarTrabajador }
}
