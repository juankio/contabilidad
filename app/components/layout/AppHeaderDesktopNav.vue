<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

type ProfileItem = {
  label: string
  value: string
}

defineProps<{
  profileItems: ProfileItem[]
  profileSelection: string
  switchingProfile: boolean
  menuItems: NavigationMenuItem[]
}>()

const emit = defineEmits<{
  (e: 'selectProfile', profileId: string): void
}>()
</script>

<template>
  <nav class="hidden items-center gap-4 text-sm sm:flex">
    <USelect
      v-if="profileItems.length > 1"
      :model-value="profileSelection"
      :items="profileItems"
      size="sm"
      class="w-56"
      :loading="switchingProfile"
      @update:model-value="emit('selectProfile', $event as string)"
    />
    <UNavigationMenu :items="menuItems" />
  </nav>
</template>
