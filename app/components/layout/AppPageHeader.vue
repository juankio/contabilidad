<script setup lang="ts">
import { computed } from 'vue'
import { refreshAuthUser } from '../../composables/auth/useAuth'

const props = defineProps<{
  title?: string
  subtitle?: string
}>()

const { activeProfileName } = useProfile()

const greeting = computed(() => {
  if (props.subtitle) return props.subtitle
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
})

const finalTitle = computed(() => props.title || activeProfileName.value || 'Mi Contabilidad')

const logout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await refreshAuthUser()
  await navigateTo('/login')
}

const goToProfile = async () => {
  await navigateTo('/perfil')
}
</script>

<template>
  <header class="anim-up mb-8 w-full overflow-hidden rounded-[2rem] border border-white/60 bg-white/60 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 min-w-0">
      <div class="flex items-center gap-4 sm:gap-5 min-w-0">
        <div class="relative shrink-0">
          <div class="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-[var(--brand-500)] to-[var(--brand-600)] shadow-sm">
            <span class="text-xl font-bold text-white">{{ activeProfileName?.charAt(0).toUpperCase() || 'M' }}</span>
          </div>
          <span class="absolute -bottom-1 -right-1 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border-[3px] border-white bg-slate-700">
            <UIcon
              name="lucide:layout-dashboard"
              class="h-3 w-3 text-white"
            />
          </span>
        </div>
        <div class="space-y-1 min-w-0 flex-1">
          <p class="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-slate-400 truncate">
            {{ greeting }}
          </p>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 truncate">
            {{ finalTitle }}
          </h1>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
        <UButton
          color="neutral"
          variant="soft"
          icon="lucide:settings"
          class="rounded-xl px-5 font-medium transition-colors hover:bg-slate-100"
          @click="goToProfile"
        >
          Perfil
        </UButton>
        <UButton
          color="neutral"
          variant="ghost"
          icon="lucide:log-out"
          class="rounded-xl px-5 font-medium text-slate-500 hover:text-slate-900 transition-colors"
          @click="logout"
        >
          Salir
        </UButton>
      </div>
    </div>
  </header>
</template>
