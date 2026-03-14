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
  '/granja-cerdos': 'i-lucide-paw-print'
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
        class="text-base font-semibold text-slate-900"
      >
        Mi Contabilidad
      </NuxtLink>
    </template>

    <template #right>
      <AppHeaderDesktopNav
        :profile-items="profileItems"
        :profile-selection="profileSelection"
        :switching-profile="switchingProfile"
        :menu-items="menuItems"
        @select-profile="onDesktopProfileSelect"
      />
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
