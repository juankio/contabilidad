<script setup lang="ts">
import type { PrestamosSummary } from '../../composables/prestamos/types'

defineProps<{
  summary: PrestamosSummary
  formatCurrency: (value: number) => string
}>()
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm lg:col-span-12">
    <h1 class="text-2xl font-semibold">
      Prestamos y abonos
    </h1>
    <p class="mt-1 text-sm text-slate-500">
      Registra dinero prestado y los pagos que te van abonando, sin tocar ingresos ni gastos.
    </p>
    <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <div class="rounded-2xl bg-slate-100 px-4 py-3">
        <p class="text-xs uppercase tracking-[0.15em] text-slate-500">
          Prestado
        </p>
        <p class="mt-1 text-lg font-semibold text-slate-900">
          {{ formatCurrency(summary.totalPrestado) }}
        </p>
      </div>
      <div class="rounded-2xl bg-emerald-50 px-4 py-3">
        <p class="text-xs uppercase tracking-[0.15em] text-emerald-500">
          Recuperado
        </p>
        <p class="mt-1 text-lg font-semibold text-emerald-700">
          {{ formatCurrency(summary.totalAbonado) }}
        </p>
      </div>
      <div class="rounded-2xl bg-amber-50 px-4 py-3">
        <p class="text-xs uppercase tracking-[0.15em] text-amber-500">
          Pendiente
        </p>
        <p class="mt-1 text-lg font-semibold text-amber-700">
          {{ formatCurrency(summary.totalPendiente) }}
        </p>
      </div>
      <div class="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
        <p class="text-xs uppercase tracking-[0.15em] text-slate-500">
          Abiertos
        </p>
        <p class="mt-1 text-lg font-semibold text-slate-900">
          {{ summary.activos }}
        </p>
      </div>
      <div class="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
        <p class="text-xs uppercase tracking-[0.15em] text-slate-500">
          Pagados
        </p>
        <p class="mt-1 text-lg font-semibold text-slate-900">
          {{ summary.cerrados }}
        </p>
      </div>
    </div>
  </div>
</template>
