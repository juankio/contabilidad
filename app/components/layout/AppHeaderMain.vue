<script setup lang="ts">
import AppHeaderDesktopNav from './AppHeaderDesktopNav.vue'
import AppHeaderMobileMenu from './AppHeaderMobileMenu.vue'
import { useHeaderProfiles } from '../../composables/layout/useHeaderProfiles'

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
</script>

<template>
  <UHeader
    v-model:open="mobileMenuOpen"
    mode="drawer"
    :menu="{ direction: 'bottom', inset: true }"
    :toggle="{ color: 'neutral', variant: 'outline', size: 'sm', square: true, class: 'sm:hidden' }"
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
        @select-profile="onDesktopProfileSelect"
      />
    </template>

    <template #body>
      <AppHeaderMobileMenu
        :profiles="profileList"
        :active-profile-id="activeProfileId"
        :profile-selection="profileSelection"
        :switching-profile="switchingProfile"
        @select-profile="onMobileProfileSelect"
        @close-menu="mobileMenuOpen = false"
      />
    </template>
  </UHeader>
</template>
