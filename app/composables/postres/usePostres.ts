type Postre = { id: string, name: string, price: number }
type Insumo = { id: string, name: string, unit: string, cost: number }
type RecetaItem = { insumoId: string, yields: number }
type Venta = { id: string, postreId: string, qty: number, date: string }

const uid = () => Math.random().toString(36).slice(2, 10)

export function usePostres() {
  const postres = useState<Postre[]>('postres:list', () => [])
  const insumos = useState<Insumo[]>('postres:insumos', () => [])
  const recetas = useState<Record<string, RecetaItem[]>>('postres:recetas', () => ({}))
  const ventas = useState<Venta[]>('postres:ventas', () => [])
  const sending = ref(false)
  const sendError = ref('')
  const sendSuccess = ref('')

  const addPostre = (name: string, price: number) => {
    const clean = name.trim()
    if (!clean || price <= 0) return false
    postres.value.push({ id: uid(), name: clean, price })
    return true
  }
  const addInsumo = (name: string, unit: string, cost: number) => {
    const clean = name.trim()
    if (!clean || cost <= 0) return false
    insumos.value.push({ id: uid(), name: clean, unit: unit.trim(), cost })
    return true
  }
  const addRecetaItem = (postreId: string, insumoId: string, yields: number) => {
    if (!postreId || !insumoId || yields <= 0) return false
    const list = recetas.value[postreId] ?? []
    recetas.value = { ...recetas.value, [postreId]: [...list, { insumoId, yields }] }
    return true
  }
  const addVenta = (postreId: string, qty: number, date: string) => {
    if (!postreId || qty <= 0) return false
    ventas.value.push({ id: uid(), postreId, qty, date })
    return true
  }

  const costUnit = (postreId: string) =>
    (recetas.value[postreId] ?? []).reduce((sum, item) => {
      const insumo = insumos.value.find(row => row.id === item.insumoId)
      const yields = item.yields || 1
      return sum + (insumo?.cost ?? 0) / yields
    }, 0)
  const report = computed(() => {
    const ingresos = ventas.value.reduce((sum, venta) => {
      const postre = postres.value.find(row => row.id === venta.postreId)
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

  return { postres, insumos, recetas, ventas, addPostre, addInsumo, addRecetaItem, addVenta, costUnit, report, sending, sendError, sendSuccess, sendToContabilidad }
}
