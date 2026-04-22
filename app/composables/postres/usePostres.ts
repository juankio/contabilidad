import { getRequestError } from '../prestamos/helpers'

export type Postre = { _id: string, name: string, price: number, receta?: RecetaItem[] }
export type Insumo = { _id: string, name: string, unit: string, cost: number }
export type RecetaItem = { insumoId: string, yields: number }
export type Venta = { _id: string, postreId: string, qty: number, date: string }

export function usePostres() {
  const postres = ref<Postre[]>([])
  const insumos = ref<Insumo[]>([])
  const recetas = ref<Record<string, RecetaItem[]>>({})
  const ventas = ref<Venta[]>([])

  const loadingData = ref(true)
  const sending = ref(false)
  const sendError = ref('')
  const sendSuccess = ref('')

  const fetchData = async () => {
    loadingData.value = true
    try {
      const [p, i, v] = await Promise.all([
        $fetch<Postre[]>('/api/postres'),
        $fetch<Insumo[]>('/api/postres/insumos'),
        $fetch<Venta[]>('/api/postres/ventas')
      ])
      postres.value = p
      insumos.value = i
      ventas.value = v

      const newRecetas: Record<string, RecetaItem[]> = {}
      for (const po of p) {
        if (po.receta) newRecetas[po._id] = po.receta
      }
      recetas.value = newRecetas
    } catch (e) {
      console.error(e)
    } finally {
      loadingData.value = false
    }
  }

  const crear = async (type: 'postres' | 'insumos' | 'ventas', payload: Record<string, any>) => {
    try {
      const url = type === 'postres' ? '/api/postres' : `/api/postres/${type}`
      await $fetch(url, { method: 'POST', body: payload })
      await fetchData()
    } catch (error) {
      throw new Error(getRequestError(error, 'No se pudo crear.'))
    }
  }

  const editar = async (type: 'postres' | 'insumos' | 'ventas', id: string, payload: Record<string, any>) => {
    try {
      const url = type === 'postres' ? `/api/postres/${id}` : `/api/postres/${type}/${id}`
      await $fetch(url, { method: 'PUT', body: payload })
      await fetchData()
    } catch (error) {
      throw new Error(getRequestError(error, 'No se pudo editar.'))
    }
  }

  const eliminar = async (type: 'postres' | 'insumos' | 'ventas', id: string) => {
    try {
      const url = type === 'postres' ? `/api/postres/${id}` : `/api/postres/${type}/${id}`
      await $fetch(url, { method: 'DELETE' })
      await fetchData()
    } catch (error) {
      throw new Error(getRequestError(error, 'No se pudo eliminar.'))
    }
  }

  const addRecetaItem = async (postreId: string, insumoId: string, yields: number) => {
    const po = postres.value.find(p => p._id === postreId)
    if (!po) throw new Error('Postre no encontrado')
    const current = recetas.value[postreId] ?? []
    const updated = [...current, { insumoId, yields }]
    await editar('postres', postreId, { receta: updated })
  }

  const costUnit = (postreId: string) =>
    (recetas.value[postreId] ?? []).reduce((sum, item) => {
      const insumo = insumos.value.find(row => row._id === item.insumoId)
      const yields = item.yields || 1
      return sum + (insumo?.cost ?? 0) / yields
    }, 0)

  const report = computed(() => {
    const ingresos = ventas.value.reduce((sum, venta) => {
      const postre = postres.value.find(row => row._id === venta.postreId)
      return sum + (postre?.price ?? 0) * venta.qty
    }, 0)
    const costos = ventas.value.reduce((sum, venta) => sum + costUnit(venta.postreId) * venta.qty, 0)
    return { ingresos, costos, utilidad: ingresos - costos }
  })

  const sendToContabilidad = async () => {
    sendError.value = ''
    sendSuccess.value = ''
    const { utilidad } = report.value
    if (!utilidad) {
      sendError.value = 'No hay utilidad o perdida para enviar.'
      return
    }
    sending.value = true
    try {
      const isIngreso = utilidad > 0
      await $fetch(isIngreso ? '/api/ingresos' : '/api/gastos', {
        method: 'POST',
        body: {
          description: 'Utilidad postres',
          category: 'Postres',
          amount: Math.abs(utilidad)
        }
      })
      await refreshNuxtData(['resumen', 'movimientos', 'categorias'])
      sendSuccess.value = 'Enviado a contabilidad.'
    } catch {
      sendError.value = 'No se pudo enviar.'
    } finally {
      sending.value = false
    }
  }

  return {
    postres, insumos, recetas, ventas,
    fetchData, crear, editar, eliminar,
    addRecetaItem, costUnit, report,
    loadingData, sending, sendError, sendSuccess, sendToContabilidad
  }
}
