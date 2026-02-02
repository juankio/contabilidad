<script setup lang="ts">
const {
  resumen,
  pending,
  error,
  exporting,
  exportResumen,
  formatCurrency
} = await useResumen()
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm md:col-span-2 lg:col-span-1">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
          Balance mensual
        </p>
        <h1 class="mt-2 text-2xl font-semibold">
          {{ resumen?.month || 'Mes actual' }}
        </h1>
        <p class="mt-2 text-sm text-slate-500">
          Resumen claro para decidir rapido.
        </p>
      </div>
      <button
        type="button"
        class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 disabled:opacity-60"
        :disabled="exporting"
        @click="exportResumen"
      >
        {{ exporting ? 'Exportando...' : 'Exportar Excel' }}
      </button>
    </div>

    <div class="mt-5 grid gap-3">
      <div
        v-if="pending"
        class="rounded-2xl border border-slate-100 px-4 py-3 text-sm text-slate-500"
      >
        Cargando resumen...
      </div>
      <div
        v-else-if="error"
        class="rounded-2xl border border-rose-100 px-4 py-3 text-sm text-rose-500"
      >
        No se pudo cargar el resumen.
      </div>
      <template v-else>
        <div class="rounded-2xl bg-emerald-50 px-4 py-3">
          <p class="text-xs uppercase tracking-[0.2em] text-emerald-500">
            Ingresos
          </p>
          <p class="mt-1 text-xl font-semibold text-emerald-700">
            {{ formatCurrency(resumen?.ingresos ?? 0) }}
          </p>
        </div>
        <div class="rounded-2xl bg-amber-50 px-4 py-3">
          <p class="text-xs uppercase tracking-[0.2em] text-amber-500">
            Gastos
          </p>
          <p class="mt-1 text-xl font-semibold text-amber-700">
            {{ formatCurrency(resumen?.gastos ?? 0) }}
          </p>
        </div>
        <div class="rounded-2xl bg-slate-900 px-4 py-3 text-white">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-300">
            Saldo
          </p>
          <p class="mt-1 text-xl font-semibold">
            {{ formatCurrency(resumen?.saldo ?? 0) }}
          </p>
        </div>
      </template>
    </div>
  </div>
</template>
