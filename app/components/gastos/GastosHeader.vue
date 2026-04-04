<script setup lang="ts">
defineProps<{
  exporting: boolean
  onExport: () => void
}>()
</script>

<template>
  <div class="anim-up rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-12">
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
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
      <UButton
        color="neutral"
        variant="soft"
        icon="lucide:file-spreadsheet"
        :loading="exporting"
        :disabled="exporting"
        @click="onExport"
      >
        Exportar Excel
      </UButton>
    </div>
  </div>
</template>
