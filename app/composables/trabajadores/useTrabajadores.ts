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
    await $fetch('/api/trabajadores', { method: 'POST', body: payload })
    await fetchTrabajadores()
  }

  const pagarTrabajador = async (payload: any) => {
    await $fetch('/api/trabajadores/pagos', { method: 'POST', body: payload })
  }

  return { trabajadores, loading, fetchTrabajadores, crearTrabajador, pagarTrabajador }
}
