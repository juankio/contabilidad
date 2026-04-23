import { getRequestError } from '../prestamos/helpers'

export type Postre = { _id: string, name: string, price: number, receta?: RecetaItem[] }
export type Insumo = { _id: string, name: string, unit: string, cost: number }
export type RecetaItem = { insumoId: string, yields: number }
export type Venta = { _id: string, postreId: string, qty: number, date: string }

// Estado global para el módulo de postres
const postres = ref<Postre[]>([])
const insumos = ref<Insumo[]>([])
const recetas = ref<Record<string, RecetaItem[]>>({})
const ventas = ref<Venta[]>([])
const activePostreId = ref<string>('')

const loadingData = ref(true)
const sending = ref(false)
const sendError = ref('')
const sendSuccess = ref('')
const activePostre = ref<Postre | null>(null)

export function usePostres() {
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
    return {
      ingresos,
      costos,
      rentabilidad: ingresos - costos,
      isEmpty: ingresos === 0 && costos === 0
    }
  })

  const sendToContabilidad = async () => {
    sendError.value = ''
    sendSuccess.value = ''
    const { rentabilidad } = report.value
    if (!rentabilidad) {
      sendError.value = 'No hay utilidad o perdida para enviar.'
      return
    }
    sending.value = true
    try {
      const isIngreso = rentabilidad > 0
      const payload = {
        amount: Math.abs(rentabilidad),
        description: `Utilidad módulo de postres (${new Date().toLocaleString('es-CO', { month: 'long', year: 'numeric' })})`,
        category: 'Postres',
        date: new Date().toISOString()
      }
      await $fetch(isIngreso ? '/api/ingresos' : '/api/gastos', {
        method: 'POST',
        body: payload
      })
      sendSuccess.value = 'ok'
      setTimeout(() => { sendSuccess.value = '' }, 3000)
    } catch (e) {
      sendError.value = getRequestError(e, 'No se pudo sincronizar')
    } finally {
      sending.value = false
    }
  }

  const activePostreCost = computed(() => {
    if (!activePostre.value) return 0
    return costUnit(activePostre.value._id)
  })

  const activePostreProfit = computed(() => {
    if (!activePostre.value) return 0
    return activePostre.value.price - activePostreCost.value
  })

  const getInsumoName = (id: string) => {
    return insumos.value.find(i => i._id === id)?.name || 'Insumo eliminado'
  }

  const getInsumoUnit = (id: string) => {
    return insumos.value.find(i => i._id === id)?.unit || ''
  }

  const getInsumoCost = (id: string, qty: number) => {
    const insumo = insumos.value.find(i => i._id === id)
    if (!insumo || !insumo.cost) return 0
    return (insumo.cost / (insumo.cost || 1)) * qty // Fallback simplificado
  }

  return {
    postres, insumos, recetas, ventas,
    fetchData, crear, editar, eliminar,
    addRecetaItem, costUnit, report,
    loadingData, sending, sendError, sendSuccess, sendToContabilidad,
    activePostre, activePostreCost, activePostreProfit,
    getInsumoName, getInsumoUnit, getInsumoCost,
    removeRecetaItem: async (postreId: string, insumoId: string) => {
      const rec = recetas.value[postreId]?.filter(r => r.insumoId !== insumoId) || []
      await editar('postres', postreId, { receta: rec })
    },
    activePostreId
  }
}
