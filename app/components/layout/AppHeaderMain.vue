<script setup lang="ts">
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

const { navItems, launcherItems } = useModuleNavigation()
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

const launcherApps = computed(() => launcherItems.value.map((item) => {
  return {
    label: item.label,
    to: item.to,
    description: item.description,
    moduleKey: item.moduleKey,
    icon: iconByRoute[item.to] ?? 'i-lucide-circle',
    active: route.path.startsWith(item.to)
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
      overlay: 'lg:hidden backdrop-blur-sm bg-slate-900/20',
      content: 'lg:hidden rounded-t-[2rem] border border-slate-200 bg-white shadow-2xl pb-4',
      body: 'p-3',
      container: 'mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 h-[60px] sm:h-[72px] grid grid-cols-[auto_1fr_auto] gap-2 lg:gap-4 w-full items-center',
      left: 'min-w-0 flex items-center',
      center: 'min-w-0 flex items-center justify-end overflow-hidden',
      right: 'flex items-center justify-end shrink-0'
    }"
  >
    <template #left>
      <div class="flex items-center gap-3 lg:gap-5 shrink-0">
        <NuxtLink
          to="/"
          no-prefetch
          class="flex items-center gap-2.5 group"
        >
          <AppLogo />
          <span class="text-lg sm:text-xl font-black text-slate-900 tracking-tight transition-colors group-hover:text-[var(--brand-600)] shrink-0">Mi Contabilidad</span>
        </NuxtLink>

        <!-- Divider Style Vercel -->
        <div
          v-if="profileItems.length > 1"
          class="hidden md:flex h-6 w-px bg-slate-300/80 transform rotate-12 shrink-0"
        />

        <!-- Profile Selector / Workspace Switcher -->
        <USelectMenu
          v-if="profileItems.length > 1"
          :model-value="profileSelection"
          :items="profileItems"
          value-key="value"
          label-key="label"
          class="hidden md:flex w-24 lg:w-36 shrink-0"
          variant="ghost"
          color="neutral"
          size="lg"
          :loading="switchingProfile"
          :ui="{ base: 'font-semibold text-slate-700 bg-transparent hover:bg-transparent border-0 ring-0 shadow-none', leadingIcon: 'text-[var(--brand-600)] size-4' }"
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

    <div class="hidden items-center lg:flex w-full justify-end min-w-0 pr-2 lg:pr-4">
      <AppHeaderDesktopNav
        :menu-items="menuItems"
        :launcher-apps="launcherApps"
      />
    </div>

    <template #right>
      <div class="flex items-center gap-2">
        <!-- Any other right items if needed -->
      </div>
    </template>

    <template #toggle="{ open, toggle }">
      <UButton
        class="lg:hidden"
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
        :menu-items="[...menuItems, ...launcherApps]"
        @select-profile="onMobileProfileSelect"
        @close-menu="mobileMenuOpen = false"
      />
    </template>
  </UHeader>
</template>
