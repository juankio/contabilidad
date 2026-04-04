<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

type Profile = {
  _id: string
  name: string
  avatarIcon?: string
}

defineProps<{
  profiles: Profile[]
  activeProfileId: string | null
  profileSelection: string
  switchingProfile: boolean
  menuItems: NavigationMenuItem[]
}>()

const emit = defineEmits<{
  (e: 'selectProfile', profileId: string): void
  (e: 'closeMenu'): void
}>()
</script>

<template>
  <div class="grid gap-3 sm:hidden">
    <!-- Profile switcher -->
    <div
      v-if="profiles.length > 1"
      class="rounded-2xl bg-slate-50 p-2.5"
    >
      <p class="mb-2 px-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
        Perfil activo
      </p>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="profile in profiles"
          :key="profile._id"
          type="button"
          class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95"
          :class="activeProfileId === profile._id
            ? 'text-white shadow-sm'
            : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'"
          :style="activeProfileId === profile._id ? { background: 'var(--brand-600)' } : {}"
          :disabled="switchingProfile"
          @click="emit('selectProfile', profile._id)"
        >
          <UIcon
            :name="profile.avatarIcon || 'i-lucide-user'"
            class="size-3.5"
          />
          {{ profile.name }}
        </button>
      </div>
    </div>

    <!-- Icon grid nav -->
    <div class="grid grid-cols-3 gap-2">
      <NuxtLink
        v-for="item in menuItems"
        :key="String(item.to)"
        :to="item.to"
        class="flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all duration-200 active:scale-[0.96]"
        :class="item.active
          ? 'border-transparent text-white shadow-sm'
          : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:text-slate-800'"
        :style="item.active ? { background: 'var(--brand-600)' } : {}"
        @click="emit('closeMenu')"
      >
        <UIcon
          :name="String(item.icon)"
          class="size-5 shrink-0"
        />
        <span class="text-xs font-medium leading-none">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </div>
</template>
