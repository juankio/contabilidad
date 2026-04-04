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
    <section class="mx-auto max-w-6xl px-4 pb-12 pt-6">
      <header class="anim-up mb-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style="background: var(--brand-600)"
            >
              <UIcon
                name="lucide:user-round"
                class="h-5 w-5 text-white"
              />
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
                {{ greeting }}
              </p>
              <h1 class="text-lg font-semibold text-slate-900">
                {{ activeProfileName || 'Mi Contabilidad' }}
              </h1>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <UButton
              color="neutral"
              variant="soft"
              icon="lucide:settings"
              size="sm"
              @click="goToProfile"
            >
              Perfil
            </UButton>
            <UButton
              color="error"
              variant="soft"
              icon="lucide:log-out"
              size="sm"
              @click="logout"
            >
              Salir
            </UButton>
          </div>
        </div>
      </header>

      <!-- Grid de tarjetas -->
      <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <BalanceCard class="anim-up-1" />
        <MovementForm class="anim-up-2" />
        <RecentMovements class="anim-up-3" />
        <CategoriesCard class="anim-up-4" />
      </div>
    </section>
  </main>
</template>
