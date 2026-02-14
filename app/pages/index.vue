<script setup lang="ts">
import BalanceCard from '../components/BalanceCard.vue'
import MovementForm from '../components/MovementForm.client.vue'
import RecentMovements from '../components/RecentMovements.vue'
import CategoriesCard from '../components/CategoriesCard.vue'

const authUser = useAuthUser()
const { activeProfileName } = useProfile()

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
    <section class="mx-auto max-w-6xl px-4 pb-10 pt-6">
      <header class="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/80 p-4 shadow-sm">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-slate-400">
            Panel
          </p>
          <h1 class="text-2xl font-semibold text-slate-900">
            Contabilidad
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <span class="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
            {{ activeProfileName || authUser?.email || 'Sesion activa' }}
          </span>
          <button
            class="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300"
            type="button"
            @click="goToProfile"
          >
            Editar perfil
          </button>
          <button
            class="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300"
            type="button"
            @click="logout"
          >
            Cerrar sesion
          </button>
        </div>
      </header>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <BalanceCard />
        <MovementForm />
        <RecentMovements />
        <CategoriesCard />
      </div>
    </section>
  </main>
</template>
