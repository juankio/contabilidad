<script setup lang="ts">
import AppHeaderDesktopNav from './AppHeaderDesktopNav.vue'
import AppHeaderMobileMenu from './AppHeaderMobileMenu.vue'
import { useHeaderProfiles } from '../../composables/layout/useHeaderProfiles'
import { useModuleNavigation } from '../../composables/modules/useModuleNavigation'
import type { NavigationMenuItem } from '@nuxt/ui'

const {
  mobileMenuOpen,
  switchingProfile,
  profileSelection,
  activeProfileId,
  profileList,
  profileItems,
  onDesktopProfileSelect,
  onMobileProfileSelect
} = useHeaderProfiles()

const { navItems } = useModuleNavigation()
const route = useRoute()

const iconByRoute: Record<string, string> = {
  '/': 'i-lucide-home',
  '/gastos': 'i-lucide-wallet',
  '/reportes': 'i-lucide-line-chart',
  '/prestamos': 'i-lucide-handshake',
  '/catalogo-tienda': 'i-lucide-store',
  '/catalogo-postres': 'i-lucide-cake',
  '/granja-cerdos': 'i-lucide-paw-print',
  '/planeador': 'i-lucide-shopping-bag'
}

const menuItems = computed<NavigationMenuItem[]>(() => navItems.value.map((item) => {
  const isRoot = item.to === '/'
  return {
    label: item.label,
    to: item.to,
    icon: iconByRoute[item.to] ?? 'i-lucide-circle',
    active: isRoot ? route.path === '/' : route.path.startsWith(item.to)
  }
}))
</script>

<template>
  <UHeader
    v-model:open="mobileMenuOpen"
    mode="drawer"
    :menu="{ direction: 'bottom', inset: true }"
    :toggle="false"
    class="border-b border-slate-200 bg-white/90 text-slate-900 backdrop-blur"
    :ui="{
      overlay: 'sm:hidden',
      content: 'sm:hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl',
      body: 'p-3'
    }"
  >
    <template #left>
      <NuxtLink
        to="/"
        no-prefetch
        class="flex items-center gap-2.5 group"
      >
        <!-- Logomark SVG -->
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="shrink-0 transition-transform duration-200 group-hover:scale-105"
        >
          <rect width="30" height="30" rx="8" style="fill: var(--brand-600)" />
          <!-- Líneas de libro contable -->
          <path d="M9 11h12" stroke="white" stroke-width="2" stroke-linecap="round" />
          <path d="M9 15.5h8" stroke="white" stroke-width="2" stroke-linecap="round" />
          <path d="M9 20h10" stroke="white" stroke-width="2" stroke-linecap="round" />
          <!-- Pequeño acento superior derecho -->
          <circle cx="21.5" cy="9.5" r="2.5" fill="white" fill-opacity="0.35" />
        </svg>
        <span class="text-base font-semibold text-slate-900 tracking-tight">Mi Contabilidad</span>
      </NuxtLink>
    </template>

    <template #right>
      <div class="flex items-center gap-2">
        <div class="hidden items-center sm:flex">
          <AppHeaderDesktopNav
            :profile-items="profileItems"
            :profile-selection="profileSelection"
            :switching-profile="switchingProfile"
            :menu-items="menuItems"
            @select-profile="onDesktopProfileSelect"
          />
        </div>
      </div>
    </template>

    <template #toggle="{ open, toggle }">
      <UButton
        class="sm:hidden"
        color="neutral"
        :variant="open ? 'soft' : 'ghost'"
        size="md"
        square
        :icon="open ? 'i-lucide-x' : 'i-lucide-align-right'"
        :aria-label="open ? 'Cerrar menu' : 'Abrir menu'"
        :ui="{
          base: 'rounded-xl ring-1 ring-slate-200/80 shadow-sm transition-all',
          leadingIcon: 'size-5'
        }"
        @click="toggle"
      />
    </template>

    <template #body>
      <AppHeaderMobileMenu
        :profiles="profileList"
        :active-profile-id="activeProfileId"
        :profile-selection="profileSelection"
        :switching-profile="switchingProfile"
        :menu-items="menuItems"
        @select-profile="onMobileProfileSelect"
        @close-menu="mobileMenuOpen = false"
      />
    </template>
  </UHeader>
</template>
