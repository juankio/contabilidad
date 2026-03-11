<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { toRefs } from 'vue'

type ProfileItem = {
  label: string
  value: string
  icon?: string
}

const emit = defineEmits<{
  (e: 'selectProfile', profileId: string): void
}>()

const props = defineProps<{
  profileItems: ProfileItem[]
  profileSelection: string
  switchingProfile: boolean
  menuItems: NavigationMenuItem[]
}>()

const { profileItems, profileSelection, switchingProfile, menuItems } = toRefs(props)

const activeProfileIcon = computed(() =>
  props.profileItems.find(item => item.value === props.profileSelection)?.icon
)
</script>

<template>
  <nav class="hidden items-center gap-4 text-sm sm:flex">
    <USelectMenu
      v-if="profileItems.length > 1"
      :model-value="profileSelection"
      :items="profileItems"
      value-key="value"
      label-key="label"
      size="sm"
      class="w-60"
      :loading="switchingProfile"
      @update:model-value="emit('selectProfile', $event as string)"
    >
      <template #leading>
        <UIcon
          v-if="activeProfileIcon"
          :name="activeProfileIcon"
          class="h-4 w-4 text-slate-500"
        />
      </template>
    </USelectMenu>
    <UNavigationMenu :items="menuItems" />
  </nav>
</template>
