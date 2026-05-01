<script setup lang="ts">
import { computed, onMounted } from 'vue'
import PlaneadorDashboard from '../components/planeador/PlaneadorDashboard.vue'
import { usePlaneador } from '../composables/planeador/usePlaneador'
import type { NuevoPlan } from '../composables/planeador/usePlaneador'
import { useToast, useFetch } from '#imports'

const {
  planes, loading, error, submitting, submitError,
  planesPorMes, formatCurrency, labelMes,
  fetchPlanes, crearPlan, actualizarPlan, toggleCompletado, eliminarPlan
} = usePlaneador()

const { data: resumen } = useFetch('/api/resumen', { key: 'resumen', lazy: true })
const saldoDisponible = computed(() =>
  (resumen.value as { saldoDisponible?: number, saldo?: number } | null)?.saldoDisponible
  ?? (resumen.value as { saldoDisponible?: number, saldo?: number } | null)?.saldo
  ?? 0
)

const toast = useToast()

onMounted(() => fetchPlanes())

async function handleCrear(nuevo: NuevoPlan, onSuccess: () => void) {
  const ok = await crearPlan(nuevo)
  if (ok) {
    onSuccess()
    toast.add({ title: 'Meta añadida', description: 'Tu compra planificada fue agregada exitosamente.', icon: 'lucide:target', color: 'success' })
  }
}

async function handleEditar(id: string, updates: Partial<NuevoPlan>, onSuccess: () => void) {
  const ok = await actualizarPlan(id, updates)
  if (ok) {
    onSuccess()
    toast.add({ title: 'Plan actualizado', description: 'Los detalles de la compra fueron actualizados.', icon: 'lucide:check-circle', color: 'success' })
  }
}

async function handleToggle(id: string) {
  const plan = planes.value.find(p => p._id === id)
  const current = plan?.completado || false
  await toggleCompletado(id)
  if (!current) {
    toast.add({ title: '¡Meta lograda!', description: 'Felicidades por alcanzar tu compra planificada.', icon: 'lucide:party-popper', color: 'success' })
  }
}

async function handleEliminar(id: string) {
  await eliminarPlan(id)
  toast.add({ title: 'Meta eliminada', description: 'La compra fue eliminada del planeador.', icon: 'lucide:trash-2', color: 'neutral' })
}
</script>

<template>
  <div class="h-full">
    <PlaneadorDashboard
      :planes="planes"
      :loading="loading"
      :error="error"
      :submitting="submitting"
      :submit-error="submitError"
      :planes-por-mes="planesPorMes"
      :saldo-disponible="saldoDisponible"
      :format-currency="formatCurrency"
      :label-mes="labelMes"
      @crear="handleCrear"
      @editar="handleEditar"
      @toggle="handleToggle"
      @eliminar="handleEliminar"
    />
  </div>
</template>