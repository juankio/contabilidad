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
    await $fetch('/api/granja/lotes', { method: 'POST', body: payload })
    await fetchLotes()
  }

  const comprarConcentrado = async (payload: any) => {
    await $fetch('/api/granja/concentrado', { method: 'POST', body: payload })
  }

  return { lotes, loading, fetchLotes, crearLote, comprarConcentrado }
}
