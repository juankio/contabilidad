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

const { profileItems, profileSelection, switchingProfile } = toRefs(props)

const activeProfileLabel = computed(() =>
  props.profileItems.find(item => item.value === props.profileSelection)?.label
)
const activeProfileIcon = computed(() =>
  props.profileItems.find(item => item.value === props.profileSelection)?.icon
)
</script>

<template>
  <nav class="hidden items-center gap-2.5 sm:flex">
    <!-- Profile pill -->
    <USelectMenu
      v-if="profileItems.length > 1"
      :model-value="profileSelection"
      :items="profileItems"
      value-key="value"
      label-key="label"
      size="sm"
      class="w-44"
      placeholder="Perfil"
      :aria-label="activeProfileLabel || 'Selecciona un perfil'"
      :loading="switchingProfile"
      @update:model-value="(v) => emit('selectProfile', String(v))"
    >
      <template #leading>
        <UIcon
          v-if="activeProfileIcon"
          :name="activeProfileIcon"
          class="size-3.5"
          :style="{ color: 'var(--brand-600)' }"
        />
      </template>
    </USelectMenu>

    <!-- Nav island — elevated pill track -->
    <div class="nav-island flex items-center rounded-full p-1">
      <NuxtLink
        v-for="item in menuItems"
        :key="String(item.to)"
        :to="item.to"
        class="nav-item relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 active:scale-[0.96]"
        :class="item.active ? 'nav-item--active text-slate-900' : 'text-slate-500 hover:text-slate-700'"
      >
        <!-- Active glow bubble -->
        <span
          v-if="item.active"
          class="nav-bubble absolute inset-0 rounded-full bg-white shadow-md"
        />
        <UIcon
          :name="String(item.icon)"
          class="relative z-10 size-3.5 shrink-0 transition-all duration-300"
          :style="item.active ? { color: 'var(--brand-600)' } : {}"
        />
        <span class="relative z-10">{{ item.label }}</span>

        <!-- Active dot indicator -->
        <span
          v-if="item.active"
          class="nav-dot absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
          :style="{ background: 'var(--brand-600)' }"
        />
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
.nav-island {
  background: linear-gradient(135deg, #f1f5f9 0%, #e8edf5 100%);
  box-shadow:
    inset 0 1px 3px rgba(0,0,0,0.08),
    inset 0 1px 2px rgba(0,0,0,0.04),
    0 1px 0 rgba(255,255,255,0.8);
}

.nav-bubble {
  box-shadow:
    0 1px 3px rgba(0,0,0,0.12),
    0 2px 8px rgba(0,0,0,0.06),
    inset 0 1px 0 rgba(255,255,255,0.9);
}

.nav-item--active {
  text-shadow: none;
}
</style>
