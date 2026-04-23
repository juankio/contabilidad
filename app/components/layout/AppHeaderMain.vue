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
  '/planeador': 'i-lucide-shopping-bag',
  '/trabajadores': 'i-lucide-users'
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
    class="border-b border-slate-200/80 bg-white/95 text-slate-900 backdrop-blur-2xl shadow-sm sticky top-0 z-50 transition-all duration-300"
    :ui="{
      overlay: 'sm:hidden backdrop-blur-sm bg-slate-900/20',
      content: 'sm:hidden rounded-t-[2rem] border border-slate-200 bg-white shadow-2xl pb-4',
      body: 'p-3',
      container: 'mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 h-[60px] sm:h-[72px] flex items-center w-full justify-between'
    }"
  >
    <template #left>
      <div class="flex items-center gap-3 lg:gap-5">
        <NuxtLink
          to="/"
          no-prefetch
          class="flex items-center gap-2.5 group"
        >
          <!-- Logomark SVG -->
          <svg
            width="36"
            height="36"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3"
          >
            <rect
              width="30"
              height="30"
              rx="10"
              style="fill: var(--brand-600)"
              class="shadow-sm"
            />
            <!-- Líneas de libro contable -->
            <path
              d="M9 11h12"
              stroke="white"
              stroke-width="2.5"
              stroke-linecap="round"
              class="transition-all duration-300 group-hover:stroke-slate-100"
            />
            <path
              d="M9 15.5h8"
              stroke="white"
              stroke-width="2.5"
              stroke-linecap="round"
              class="transition-all duration-300 group-hover:stroke-slate-100"
            />
            <path
              d="M9 20h10"
              stroke="white"
              stroke-width="2.5"
              stroke-linecap="round"
              class="transition-all duration-300 group-hover:stroke-slate-100"
            />
            <!-- Pequeño acento superior derecho -->
            <circle
              cx="21.5"
              cy="9.5"
              r="2.5"
              fill="white"
              fill-opacity="0.9"
              class="transition-all duration-300 group-hover:scale-110"
            />
          </svg>
          <span class="text-xl font-black text-slate-900 tracking-tight transition-colors group-hover:text-[var(--brand-600)] hidden sm:block">Mi Contabilidad</span>
        </NuxtLink>

        <!-- Divider Style Vercel -->
        <div
          v-if="profileItems.length > 1"
          class="hidden sm:flex h-6 w-px bg-slate-300/80 transform rotate-12"
        />

        <!-- Profile Selector / Workspace Switcher -->
        <USelectMenu
          v-if="profileItems.length > 1"
          :model-value="profileSelection"
          :items="profileItems"
          value-key="value"
          label-key="label"
          class="hidden sm:flex w-44"
          variant="ghost"
          color="neutral"
          size="lg"
          :loading="switchingProfile"
          :ui="{ base: 'font-semibold text-slate-700 bg-transparent hover:bg-slate-50 border-0 ring-0 shadow-none', leadingIcon: 'text-[var(--brand-600)] size-4' }"
          @update:model-value="(v) => onDesktopProfileSelect(String(v))"
        >
          <template #leading>
            <UIcon
              :name="profileItems.find(p => p.value === profileSelection)?.icon || 'lucide:briefcase'"
              class="size-5 text-[var(--brand-600)]"
            />
          </template>
        </USelectMenu>
      </div>
    </template>

    <template #right>
      <div class="flex items-center gap-2 w-full justify-end">
        <div class="hidden items-center sm:flex w-full justify-end">
          <AppHeaderDesktopNav
            :menu-items="menuItems"
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
