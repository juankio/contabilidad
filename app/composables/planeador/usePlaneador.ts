import { getRequestError } from '../prestamos/helpers'

export type PlanCompra = {
  _id: string
  nombre: string
  monto: number
  fechaPlaneada: string // YYYY-MM
  descripcion: string
  completado: boolean
  createdAt: string
}

export type NuevoPlan = {
  nombre: string
  monto: string
  fechaPlaneada: string
  descripcion: string
}

export function usePlaneador() {
  const planes = useState<PlanCompra[]>('planeador:planes', () => [])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const submitting = ref(false)
  const submitError = ref<string | null>(null)

  const { formatCurrency } = useFormatters()

  // Agrupados por mes
  const planesPorMes = computed(() => {
    const meses: Record<string, PlanCompra[]> = {}
    for (const plan of planes.value) {
      const key = plan.fechaPlaneada
      if (!meses[key]) meses[key] = []
      meses[key].push(plan)
    }
    // Ordenar claves por fecha
    return Object.entries(meses)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([mes, items]) => ({ mes, items }))
  })

  const totales = computed(() => {
    const pendientes = planes.value.filter(p => !p.completado)
    const completados = planes.value.filter(p => p.completado)
    return {
      totalPendiente: pendientes.reduce((acc, p) => acc + p.monto, 0),
      totalCompletado: completados.reduce((acc, p) => acc + p.monto, 0),
      countPendientes: pendientes.length,
      countCompletados: completados.length
    }
  })

  function labelMes(mesKey: string) {
    const [year, month] = mesKey.split('-')
    const date = new Date(Number(year), Number(month) - 1, 1)
    return date.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })
  }

  async function fetchPlanes() {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<PlanCompra[]>('/api/planes-compra')
      planes.value = data
    } catch {
      error.value = 'No se pudieron cargar los planes.'
    } finally {
      loading.value = false
    }
  }

  async function crearPlan(nuevo: NuevoPlan) {
    submitting.value = true
    submitError.value = null
    try {
      const created = await $fetch<PlanCompra>('/api/planes-compra', {
        method: 'POST',
        body: {
          nombre: nuevo.nombre,
          monto: Number(nuevo.monto),
          fechaPlaneada: nuevo.fechaPlaneada,
          descripcion: nuevo.descripcion
        }
      })
      planes.value = [...planes.value, created].sort((a, b) => a.fechaPlaneada.localeCompare(b.fechaPlaneada))
      return true
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al crear el plan.'
      submitError.value = msg
      return false
    } finally {
      submitting.value = false
    }
  }

  async function actualizarPlan(id: string, updates: Partial<NuevoPlan>) {
    submitting.value = true
    submitError.value = null
    try {
      const body: any = {}
      if (updates.nombre !== undefined) body.nombre = updates.nombre
      if (updates.monto !== undefined) body.monto = Number(updates.monto)
      if (updates.fechaPlaneada !== undefined) body.fechaPlaneada = updates.fechaPlaneada
      if (updates.descripcion !== undefined) body.descripcion = updates.descripcion

      const updated = await $fetch<PlanCompra>(`/api/planes-compra/${id}`, {
        method: 'PATCH',
        body
      })

      const idx = planes.value.findIndex(p => p._id === id)
      if (idx !== -1) {
        planes.value[idx] = updated
        planes.value.sort((a, b) => a.fechaPlaneada.localeCompare(b.fechaPlaneada))
      }
      return true
    } catch (error: unknown) {
      submitError.value = getRequestError(error, 'No se pudo actualizar el plan.')
      return false
    } finally {
      submitting.value = false
    }
  }

  async function toggleCompletado(id: string) {
    const plan = planes.value.find(p => p._id === id)
    if (!plan) return
    const prev = plan.completado
    // Optimistic update
    plan.completado = !prev
    try {
      const updated = await $fetch<PlanCompra>(`/api/planes-compra/${id}`, {
        method: 'PATCH',
        body: { completado: !prev }
      })
      const idx = planes.value.findIndex(p => p._id === id)
      if (idx !== -1) planes.value[idx] = updated
    } catch {
      // Revert on error
      plan.completado = prev
    }
  }

  async function eliminarPlan(id: string) {
    try {
      await $fetch(`/api/planes-compra/${id}`, { method: 'DELETE' })
      planes.value = planes.value.filter(p => p._id !== id)
    } catch {
      // ignore
    }
  }

  return {
    planes,
    loading,
    error,
    submitting,
    submitError,
    planesPorMes,
    totales,
    formatCurrency,
    labelMes,
    fetchPlanes,
    crearPlan,
    actualizarPlan,
    toggleCompletado,
    eliminarPlan
  }
}
