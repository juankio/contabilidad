<script setup lang="ts">
import { animate, stagger } from 'animejs'

const { activeProfileName } = useProfile()
const profileInitial = computed(() => activeProfileName.value?.trim().charAt(0).toUpperCase() || 'M')

defineProps<{
  exporting: boolean
  onExport: () => void
}>()

onMounted(() => {
  if (!import.meta.client) return
  const targets = Array.from(document.querySelectorAll('.header-anim'))
  if (targets.length) {
    animate(targets, {
      y: [-20, 0],
      opacity: [0, 1],
      duration: 500,
      delay: stagger(100),
      ease: 'outQuad'
    })
  }
})
</script>

<template>
  <header class="header-anim flex flex-col sm:flex-row sm:items-center justify-between gap-6">
    <div class="flex items-center gap-4 sm:gap-5">
      <div class="relative shrink-0">
        <div class="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-[var(--brand-500)] to-[var(--brand-600)] shadow-sm">
          <UIcon
            name="lucide:receipt"
            class="h-6 w-6 sm:h-7 sm:w-7 text-white"
          />
        </div>
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
