<script setup lang="ts">
type Profile = {
  _id: string
  name: string
}

defineProps<{
  profiles: Profile[]
  activeProfileId: string | null
  profileSelection: string
  switchingProfile: boolean
}>()

const emit = defineEmits<{
  (e: 'selectProfile', profileId: string): void
  (e: 'closeMenu'): void
}>()
</script>

<template>
  <nav class="grid gap-2 text-sm sm:hidden">
    <div
      v-if="profiles.length > 1"
      class="rounded-xl bg-slate-50 p-2"
    >
      <p class="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        Perfil activo
      </p>
      <div class="overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div class="inline-flex items-center gap-2">
          <UButton
            v-for="profile in profiles"
            :key="profile._id"
            :label="profile.name"
            :icon="activeProfileId === profile._id ? 'i-lucide-check' : undefined"
            :color="activeProfileId === profile._id ? 'primary' : 'neutral'"
            :variant="activeProfileId === profile._id ? 'soft' : 'outline'"
            size="sm"
            class="shrink-0 rounded-full px-3"
            :loading="switchingProfile && profileSelection === profile._id"
            :disabled="switchingProfile"
            @click="emit('selectProfile', profile._id)"
          />
        </div>
      </div>
    </div>

    <NuxtLink
      to="/"
      no-prefetch
      class="rounded-xl border border-transparent px-3 py-2.5 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
      exact-active-class="border-slate-200 bg-slate-100 text-slate-900 font-semibold"
      @click="emit('closeMenu')"
    >
      Inicio
    </NuxtLink>
    <NuxtLink
      to="/gastos"
      no-prefetch
      class="rounded-xl border border-transparent px-3 py-2.5 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
      exact-active-class="border-slate-200 bg-slate-100 text-slate-900 font-semibold"
      @click="emit('closeMenu')"
    >
      Gastos
    </NuxtLink>
    <NuxtLink
      to="/reportes"
      no-prefetch
      class="rounded-xl border border-transparent px-3 py-2.5 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
      exact-active-class="border-slate-200 bg-slate-100 text-slate-900 font-semibold"
      @click="emit('closeMenu')"
    >
      Reportes
    </NuxtLink>
  </nav>
</template>
