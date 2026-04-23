<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const props = defineProps<{
  menuItems: NavigationMenuItem[]
}>()
</script>

<template>
  <nav class="hidden items-center gap-1 sm:flex w-full justify-end">
    <!-- Nav items -->
    <div class="flex items-center gap-2">
      <NuxtLink
        v-for="item in menuItems"
        :key="String(item.to)"
        :to="item.to"
        class="nav-link relative flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[15px] font-bold tracking-wide transition-all duration-300 hover:scale-105 active:scale-95"
        :class="item.active
          ? 'text-slate-900 bg-slate-100/80 shadow-sm'
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/80'"
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
    </div>
  </nav>
</template>

<style scoped>
.nav-link {
  will-change: transform, background, color;
}
</style>
