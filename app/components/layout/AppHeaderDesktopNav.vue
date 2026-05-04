<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

type LauncherApp = NavigationMenuItem & {
  description: string
  moduleKey: string
}

const props = defineProps<{
  menuItems: NavigationMenuItem[]
  launcherApps: LauncherApp[]
}>()
</script>

<template>
  <nav class="hidden lg:flex items-center gap-2 w-full justify-end overflow-hidden shrink min-w-0 pr-4">
    <!-- Main Core Nav items -->
    <div class="flex items-center gap-1.5 lg:gap-2 justify-end">
      <NuxtLink
        v-for="item in menuItems"
        :key="String(item.to)"
        :to="item.to"
        class="nav-link shrink-0 relative flex items-center gap-1.5 lg:gap-2.5 rounded-full px-3 lg:px-5 py-1.5 lg:py-2.5 text-xs lg:text-[15px] font-bold tracking-wide transition-all duration-300 hover:scale-105 active:scale-95"
        :class="item.active
          ? 'text-slate-900 bg-slate-100/80 shadow-sm'
          : 'text-slate-500 hover:text-slate-900 hover:bg-transparent/80'"
      >
        <UIcon
          :name="String(item.icon)"
          class="size-5 shrink-0"
          :class="item.active ? 'text-[var(--brand-600)]' : 'text-slate-400'"
        />
        <span>{{ item.label }}</span>
        <span
          v-if="item.active"
          class="absolute bottom-0 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-[var(--brand-500)]"
        />
      </NuxtLink>

      <div v-if="launcherApps.length > 0" class="h-6 w-px bg-slate-200 mx-1 rounded-full"></div>

      <AppModuleLauncher v-if="launcherApps.length > 0" :apps="launcherApps" />
    </div>
  </nav>
</template>

<style scoped>
.nav-link {
  will-change: transform, background, color;
}
</style>
