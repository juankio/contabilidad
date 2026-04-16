<script setup lang="ts">
import PlaneadorResumen from '../components/planeador/PlaneadorResumen.vue'
import PlaneadorForm from '../components/planeador/PlaneadorForm.vue'
import PlaneadorList from '../components/planeador/PlaneadorList.vue'
import { usePlaneador } from '../composables/planeador/usePlaneador'
import { useToast } from '#imports'

const {
  planes,
  loading,
  error,
  submitting,
  submitError,
  planesPorMes,
  formatCurrency,
  labelMes,
  fetchPlanes,
  crearPlan,
  toggleCompletado,
  eliminarPlan
} = usePlaneador()

const { data: resumen } = await useFetch('/api/resumen', { key: 'resumen' })
const saldoDisponible = computed(() =>
  (resumen.value as { saldoDisponible?: number, saldo?: number } | null)?.saldoDisponible
  ?? (resumen.value as { saldoDisponible?: number, saldo?: number } | null)?.saldo
  ?? 0
)

const formRef = ref<InstanceType<typeof PlaneadorForm> | null>(null)
const toast = useToast()

const totalCompletado = computed(() => planes.value.filter(p => p.completado).length)
const totalPendiente = computed(() => planes.value.filter(p => !p.completado).length)
const { activeProfileName } = useProfile()
const profileInitial = computed(() => activeProfileName.value?.trim().charAt(0).toUpperCase() || 'M')

await fetchPlanes()

async function onSubmit(nuevo: Parameters<typeof crearPlan>[0]) {
  const ok = await crearPlan(nuevo)
  if (ok && formRef.value) {
    formRef.value.reset()
    toast.add({
      title: 'Meta añadida',
      description: 'Tu compra planificada fue agregada exitosamente.',
      icon: 'lucide:target',
      color: 'success'
    })
  }
}

async function onToggle(id: string, current: boolean) {
  await toggleCompletado(id, current)
  if (!current) {
    toast.add({
      title: '¡Meta lograda!',
      description: 'Felicidades por alcanzar tu compra planificada.',
      icon: 'lucide:party-popper',
      color: 'success'
    })
  }
}

async function onEliminar(id: string) {
  await eliminarPlan(id)
  toast.add({
    title: 'Meta eliminada',
    description: 'La compra fue eliminada del planeador.',
    icon: 'lucide:trash-2',
    color: 'gray'
  })
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-screen-2xl px-4 pb-12 pt-6">
      <!-- Header -->
      <header class="anim-up mb-6 rounded-3xl bg-white p-5 shadow-sm">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <div
              class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm"
              style="background: var(--brand-600)"
            >
              <span class="text-sm font-bold text-white">
                {{ profileInitial }}
              </span>
              <span class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-700">
                <UIcon
                  name="lucide:shopping-bag"
                  class="h-3 w-3 text-white"
                />
              </span>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Módulo
              </p>
              <h1 class="text-2xl font-bold tracking-tight text-slate-900">
                Planeador de compras
              </h1>
              <p class="mt-0.5 text-xs text-slate-400">
                Planea con anticipación y controla tu presupuesto futuro.
              </p>
            </div>
          </div>

          <!-- Stats rápidas -->
          <div class="flex items-center gap-3">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
              <p class="text-xs text-slate-400">
                Pendientes
              </p>
              <p class="mt-0.5 text-2xl font-bold tracking-tight text-violet-700">
                {{ totalPendiente }}
              </p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
              <p class="text-xs text-slate-400">
                Completados
              </p>
              <p class="mt-0.5 text-2xl font-bold tracking-tight text-emerald-600">
                {{ totalCompletado }}
              </p>
            </div>
          </div>
        </div>
      </header>

      <!-- Grid -->
      <div class="grid gap-6 lg:grid-cols-12 items-start">
        <!-- Columna izquierda -->
        <div class="flex flex-col gap-6 lg:col-span-4">
          <PlaneadorResumen
            class="anim-up-1"
            :planes="planes"
            :saldo-disponible="saldoDisponible"
            :format-currency="formatCurrency"
          />
          <PlaneadorForm
            ref="formRef"
            class="anim-up-2"
            :submitting="submitting"
            :submit-error="submitError"
            @submit="onSubmit"
          />
        </div>

        <!-- Columna derecha -->
        <div class="lg:col-span-8 flex flex-col gap-6">
          <PlaneadorList
            class="anim-up-3"
            :planes-por-mes="planesPorMes"
            :loading="loading"
            :error="error"
            :format-currency="formatCurrency"
            :label-mes="labelMes"
            @toggle="onToggle"
            @eliminar="onEliminar"
          />
        </div>
      </div>
    </section>
  </main>
</template>
