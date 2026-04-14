<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

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

const activeProfileIcon = computed(() =>
  props.profileItems.find(item => item.value === props.profileSelection)?.icon
)
</script>

<template>
  <nav class="hidden items-center gap-2 sm:flex">
    <!-- Profile selector -->
    <USelectMenu
      v-if="profileItems.length > 1"
      :model-value="profileSelection"
      :items="profileItems"
      value-key="value"
      label-key="label"
      size="md"
      class="w-48"
      placeholder="Perfil"
      :loading="switchingProfile"
      @update:model-value="(v) => emit('selectProfile', String(v))"
    >
      <template #leading>
        <UIcon
          v-if="activeProfileIcon"
          :name="activeProfileIcon"
          class="size-4"
          :style="{ color: 'var(--brand-600)' }"
        />
      </template>
    </USelectMenu>

    <!-- Separator -->
    <div
      v-if="profileItems.length > 1"
      class="h-6 w-px bg-slate-200"
    />

    <!-- Nav items -->
    <div class="flex items-center gap-1">
      <NuxtLink
        v-for="item in menuItems"
        :key="String(item.to)"
        :to="item.to"
        class="nav-link relative flex items-center gap-2 rounded-xl px-4 py-2 text-base font-medium transition-all duration-200 active:scale-[0.96]"
        :class="item.active
          ? 'text-white shadow-sm'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'"
        :style="item.active ? { background: 'var(--brand-600)' } : {}"
      >
        <UIcon
          :name="String(item.icon)"
          class="size-4.5 shrink-0"
        />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
.nav-link {
  will-change: background, color;
}
</style>
