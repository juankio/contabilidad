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
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-screen-2xl px-4 pb-12 pt-6">
      <header class="anim-up mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform hover:scale-105"
              style="background: var(--brand-600)"
            >
              <UIcon
                name="lucide:user-round"
                class="h-6 w-6 text-white"
              />
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-slate-400 font-medium">
                {{ greeting }}
              </p>
              <h1 class="text-xl font-bold text-slate-900">
                {{ activeProfileName || 'Mi Contabilidad' }}
              </h1>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <UButton
              color="neutral"
              variant="soft"
              icon="lucide:settings"
              size="sm"
              class="rounded-xl px-4 transition-all"
              @click="goToProfile"
            >
              Perfil
            </UButton>
            <UButton
              color="error"
              variant="soft"
              icon="lucide:log-out"
              size="sm"
              class="rounded-xl px-4 transition-all"
              @click="logout"
            >
              Salir
            </UButton>
          </div>
        </div>
      </header>

      <!-- Grid de tarjetas -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-12 items-start">
        <BalanceCard class="anim-up-1 lg:col-span-4" />
        <MovementForm class="anim-up-2 md:col-span-2 lg:col-span-8" />
        <CategoriesCard class="anim-up-3 lg:col-span-4" />
        <RecentMovements class="anim-up-4 md:col-span-2 lg:col-span-8" />
      </div>
    </section>
  </main>
</template>
