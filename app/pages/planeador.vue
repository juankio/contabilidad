<script setup lang="ts">
import PlaneadorResumen from '../components/planeador/PlaneadorResumen.vue'
import PlaneadorForm from '../components/planeador/PlaneadorForm.vue'
import PlaneadorList from '../components/planeador/PlaneadorList.vue'
import { usePlaneador } from '../composables/planeador/usePlaneador'

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

const totalCompletado = computed(() => planes.value.filter(p => p.completado).length)
const totalPendiente = computed(() => planes.value.filter(p => !p.completado).length)

await fetchPlanes()

async function onSubmit(nuevo: Parameters<typeof crearPlan>[0]) {
  const ok = await crearPlan(nuevo)
  if (ok && formRef.value) {
    formRef.value.reset()
  }
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-6xl px-4 pb-12 pt-6">

      <!-- Header -->
      <header class="anim-up mb-8">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
              Módulo
            </p>
            <h1 class="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
              Planeador de compras
            </h1>
            <p class="mt-1 text-sm text-slate-400">
              Planea con anticipación y controla tu presupuesto futuro.
            </p>
          </div>

          <!-- Stats rápidas -->
          <div class="flex items-center gap-3">
            <div class="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
              <p class="text-xs text-slate-400">
                Pendientes
              </p>
              <p class="mt-0.5 text-lg font-semibold text-violet-700">
                {{ totalPendiente }}
              </p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
              <p class="text-xs text-slate-400">
                Completados
              </p>
              <p class="mt-0.5 text-lg font-semibold text-emerald-600">
                {{ totalCompletado }}
              </p>
            </div>
          </div>
        </div>
      </header>

      <!-- Grid -->
      <div class="grid gap-5 lg:grid-cols-3">
        <!-- Columna izquierda -->
        <div class="space-y-5 lg:col-span-1">
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
        <div class="lg:col-span-2">
          <PlaneadorList
            class="anim-up-3"
            :planes-por-mes="planesPorMes"
            :loading="loading"
            :error="error"
            :format-currency="formatCurrency"
            :label-mes="labelMes"
            @toggle="toggleCompletado"
            @eliminar="eliminarPlan"
          />
        </div>
      </div>
    </section>
  </main>
</template>
