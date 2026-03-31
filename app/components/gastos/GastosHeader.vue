<script setup lang="ts">
defineProps<{
  exporting: boolean
  onExport: () => void
}>()
</script>

<template>
  <div class="anim-up rounded-3xl bg-white p-5 shadow-sm lg:col-span-12">
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm"
          style="background: var(--brand-600)"
        >
          <UIcon
            name="lucide:wallet"
            class="h-5 w-5 text-white"
          />
        </div>
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
            Módulo
          </p>
          <h1 class="text-lg font-semibold text-slate-900">
            Gastos
          </h1>
        </div>
      </div>
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-95 disabled:opacity-50"
        :disabled="exporting"
        @click="onExport"
      >
        <UIcon
          name="lucide:file-spreadsheet"
          class="h-3.5 w-3.5"
        />
        {{ exporting ? 'Exportando...' : 'Exportar Excel' }}
      </button>
    </div>
  </div>
</template>
