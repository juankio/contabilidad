<script setup lang="ts">
import BalanceCard from '../components/BalanceCard.vue'
import MovementForm from '../components/MovementForm.client.vue'
import RecentMovements from '../components/RecentMovements.vue'
import CategoriesCard from '../components/CategoriesCard.vue'
import { refreshAuthUser } from '../composables/auth/useAuth'

const { activeProfileName } = useProfile()

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
})

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
  <main class="min-h-screen bg-slate-50/50 text-slate-900">
    <section class="mx-auto max-w-screen-2xl px-4 md:px-6 pb-12 pt-8">
      <header class="anim-up mb-8 rounded-[2rem] border border-slate-200/60 bg-white/80 p-6 sm:p-8 shadow-sm backdrop-blur-xl transition-all">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div class="flex items-center gap-5">
            <div class="relative">
              <div class="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-[var(--brand-500)] to-[var(--brand-600)] shadow-sm">
                <span class="text-xl font-bold text-white">{{ activeProfileName?.charAt(0).toUpperCase() || 'M' }}</span>
              </div>
              <span class="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-white bg-slate-700">
                <UIcon
                  name="lucide:layout-dashboard"
                  class="h-3 w-3 text-white"
                />
              </span>
            </div>
            <div class="space-y-1">
              <p class="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                {{ greeting }}
              </p>
              <h1 class="text-2xl font-bold tracking-tight text-slate-900">
                {{ activeProfileName || 'Mi Contabilidad' }}
              </h1>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-3">
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

      <!-- Grid de tarjetas principal -->
      <div class="grid gap-6 lg:grid-cols-12 items-start">
        <!-- Columna Izquierda: Balance y Categorías (4 columnas) -->
        <div class="flex flex-col gap-6 lg:col-span-4">
          <BalanceCard class="anim-up-1" />
          <CategoriesCard class="anim-up-3" />
        </div>

        <!-- Columna Derecha: Formulario y Movimientos (8 columnas) -->
        <div class="flex flex-col gap-6 lg:col-span-8">
          <MovementForm class="anim-up-2" />
          <RecentMovements class="anim-up-4" />
        </div>
      </div>
    </section>
  </main>
</template>
