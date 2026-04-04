<script setup lang="ts">
const { activeProfileName } = useProfile()
const profileInitial = computed(() => activeProfileName.value?.trim().charAt(0).toUpperCase() || 'M')

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
          class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style="background: var(--brand-600)"
        >
          <span class="text-sm font-bold text-white">
            {{ profileInitial }}
          </span>
          <span class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-700">
            <UIcon
              name="lucide:wallet"
              class="h-3 w-3 text-white"
            />
          </span>
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
