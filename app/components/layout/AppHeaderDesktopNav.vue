<script setup lang="ts">
type ProfileItem = {
  label: string
  value: string
}

defineProps<{
  profileItems: ProfileItem[]
  profileSelection: string
  switchingProfile: boolean
}>()

const emit = defineEmits<{
  (e: 'selectProfile', profileId: string): void
}>()
</script>

<template>
  <nav class="hidden items-center gap-3 text-sm sm:flex">
    <USelect
      v-if="profileItems.length > 1"
      :model-value="profileSelection"
      :items="profileItems"
      size="sm"
      class="w-52"
      :loading="switchingProfile"
      @update:model-value="emit('selectProfile', $event as string)"
    />
    <NuxtLink
      to="/"
      no-prefetch
      class="text-slate-600 hover:text-slate-900"
      exact-active-class="text-slate-900 font-semibold"
    >
      Inicio
    </NuxtLink>
    <NuxtLink
      to="/gastos"
      no-prefetch
      class="text-slate-600 hover:text-slate-900"
      exact-active-class="text-slate-900 font-semibold"
    >
      Gastos
    </NuxtLink>
    <NuxtLink
      to="/reportes"
      no-prefetch
      class="text-slate-600 hover:text-slate-900"
      exact-active-class="text-slate-900 font-semibold"
    >
      Reportes
    </NuxtLink>
  </nav>
</template>
