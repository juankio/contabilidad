<script setup lang="ts">
defineProps<{
  exporting: boolean
  onExport: () => void
}>()
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm lg:col-span-12">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">
        Gastos
      </h1>
      <button
        type="button"
        class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 disabled:opacity-60"
        :disabled="exporting"
        @click="onExport"
      >
        {{ exporting ? 'Exportando...' : 'Exportar Excel' }}
      </button>
    </div>
    <p class="mt-2 text-sm text-slate-500">
      Lista simple de gastos recientes.
    </p>
  </div>
</template>
