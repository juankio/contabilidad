<script setup lang="ts">
import type { PrestamosSummary } from '../../composables/prestamos/types'

defineProps<{
  summary: PrestamosSummary
  formatCurrency: (value: number) => string
}>()
</script>

<template>
  <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow lg:col-span-12">
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100/80 text-slate-600">
          <UIcon
            name="lucide:bar-chart-2"
            class="h-5 w-5"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Resumen global
          </h2>
          <p class="text-sm text-slate-500">
            Registra dinero prestado y los pagos que te van abonando, sin tocar ingresos ni gastos.
          </p>
        </div>
      </div>
    </div>

    <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <div class="rounded-2xl bg-slate-100 px-4 py-3">
        <p class="text-xs font-semibold uppercase tracking-widest text-slate-600">
          Prestado
        </p>
        <p class="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          {{ formatCurrency(summary.totalPrestado) }}
        </p>
      </div>
      <div class="rounded-2xl bg-emerald-50 px-4 py-3">
        <p class="text-xs font-semibold uppercase tracking-widest text-emerald-700">
          Recuperado
        </p>
        <p class="mt-1 text-2xl font-bold tracking-tight text-emerald-700">
          {{ formatCurrency(summary.totalAbonado) }}
        </p>
      </div>
      <div class="rounded-2xl bg-amber-50 px-4 py-3">
        <p class="text-xs font-semibold uppercase tracking-widest text-amber-700">
          Pendiente
        </p>
        <p class="mt-1 text-2xl font-bold tracking-tight text-amber-700">
          {{ formatCurrency(summary.totalPendiente) }}
        </p>
      </div>
      <div class="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
        <p class="text-xs font-semibold uppercase tracking-widest text-slate-600">
          Abiertos
        </p>
        <p class="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          {{ summary.activos }}
        </p>
      </div>
      <div class="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
        <p class="text-xs font-semibold uppercase tracking-widest text-slate-600">
          Pagados
        </p>
        <p class="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          {{ summary.cerrados }}
        </p>
      </div>
    </div>
  </div>
</template>
