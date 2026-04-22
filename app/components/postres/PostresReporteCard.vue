<script setup lang="ts">
import { usePostres } from '../../composables/postres/usePostres'

const { report, sendToContabilidad, sending, sendSuccess, sendError, loadingData } = usePostres()
const { formatCurrency } = useFormatters()

const rentabilidad = computed(() => {
  const ing = report.value?.ingresos || 0
  const gas = report.value?.costos || 0
  return ing - gas
})
</script>

<template>
  <section class="flex flex-col rounded-[2rem] border border-slate-200/60 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-all h-full">
    <div class="mb-6 flex items-start justify-between">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 ring-1 ring-slate-100">
          <UIcon
            name="lucide:pie-chart"
            class="h-5 w-5"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Reporte del Mes
          </h2>
          <p class="text-sm text-slate-500">
            Ingresos, costos y rentabilidad.
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="loadingData"
      class="flex-1 space-y-4"
    >
      <USkeleton class="h-20 w-full rounded-2xl" />
      <USkeleton class="h-20 w-full rounded-2xl" />
      <USkeleton class="h-10 w-full rounded-xl" />
    </div>

    <div
      v-else
      class="flex flex-col gap-4"
    >
      <!-- Ingresos Brutos -->
      <div class="anim-up group flex flex-col justify-center rounded-2xl border border-emerald-100/60 bg-emerald-50/50 px-4 py-3 transition-colors duration-200 hover:bg-emerald-50">
        <p class="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1">
          Ingresos Ventas
        </p>
        <p class="text-3xl font-extrabold tracking-tight text-emerald-700">
          {{ formatCurrency(report?.ingresos || 0) }}
        </p>
      </div>

      <!-- Costos -->
      <div class="anim-up-1 group flex flex-col justify-center rounded-2xl border border-rose-100/60 bg-rose-50/50 px-4 py-3 transition-colors duration-200 hover:bg-rose-50">
        <p class="text-[11px] font-bold uppercase tracking-wider text-rose-600 mb-1">
          Costos Producción
        </p>
        <p class="text-3xl font-extrabold tracking-tight text-rose-700">
          {{ formatCurrency(report?.costos || 0) }}
        </p>
      </div>

      <!-- Margen -->
      <div class="mt-2 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-inset ring-slate-100">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Rentabilidad</span>
        <span
          class="text-base font-bold"
          :class="rentabilidad >= 0 ? 'text-emerald-600' : 'text-rose-600'"
        >
          {{ formatCurrency(rentabilidad) }}
        </span>
      </div>

      <UButton
        v-if="rentabilidad !== 0"
        color="neutral"
        class="mt-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold"
        block
        size="lg"
        icon="lucide:arrow-right-circle"
        :loading="sending"
        @click="sendToContabilidad"
      >
        Sincronizar a Contabilidad General
      </UButton>

      <p
        v-if="sendSuccess"
        class="text-center text-sm font-bold text-emerald-600"
      >
        ¡Sincronizado con éxito!
      </p>
      <p
        v-else-if="sendError"
        class="text-center text-sm font-bold text-rose-600"
      >
        {{ sendError }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
