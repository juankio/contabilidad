<script setup lang="ts">
const { activeProfileName } = useProfile()
const profileInitial = computed(() => activeProfileName.value?.trim().charAt(0).toUpperCase() || 'M')

defineProps<{
  exporting: boolean
  onExport: () => void
}>()
</script>

<template>
  <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
    <div class="flex items-center gap-5">
      <div class="relative">
        <div class="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-[var(--brand-500)] to-[var(--brand-600)] shadow-sm">
          <span class="text-xl font-bold text-white">{{ profileInitial }}</span>
        </div>
        <span class="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-white bg-slate-700">
          <UIcon name="lucide:arrow-up-right" class="h-3 w-3 text-white" />
        </span>
      </div>
      <div class="space-y-1">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
          Mis Gastos
        </h1>
        <p class="text-sm font-medium text-slate-500">
          Gestión de salidas de dinero del mes
        </p>
      </div>
    </div>
    
    <div class="flex items-center gap-3">
      <UButton
        color="neutral"
        variant="soft"
        icon="lucide:arrow-left"
        class="rounded-xl px-5 font-medium transition-colors hover:bg-slate-100"
        to="/"
      >
        Volver
      </UButton>
      <UButton
        color="neutral"
        variant="ghost"
        icon="lucide:download"
        class="rounded-xl px-5 font-medium text-slate-500 hover:text-slate-900 transition-colors"
        :loading="exporting"
        @click="onExport"
      >
        Exportar Excel
      </UButton>
    </div>
  </header>
</template>
