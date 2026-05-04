<script setup lang="ts">
type ProfileLite = { _id: string, name: string }

defineProps<{
  profiles: ProfileLite[]
  activeProfileId: string | null
  loading: boolean
  canDeleteProfiles: boolean
}>()

const emit = defineEmits<{
  (e: 'activate', profileId: string): void
  (e: 'create' | 'deleteActive'): void
}>()
</script>

<template>
  <div class="h-full rounded-3xl bg-white border border-slate-200 bg-transparent/70 p-6 shadow-sm">
    <div class="flex items-center gap-3 text-slate-900 mb-2">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
        <UIcon
          name="lucide:users"
          class="h-5 w-5 text-slate-700"
        />
      </div>
      <div>
        <p class="text-base font-bold tracking-tight">
          Perfiles contables
        </p>
        <p class="text-xs text-slate-500">
          Tus espacios de trabajo aislados.
        </p>
      </div>
    </div>

    <div class="mt-5 flex flex-wrap gap-2">
      <button
        v-for="profile in profiles"
        :key="profile._id"
        type="button"
        class="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium shadow-sm transition-all duration-200"
        :class="profile._id === activeProfileId
          ? 'border-[var(--brand-200)] bg-[var(--brand-50)] text-[var(--brand-700)] ring-1 ring-[var(--brand-500)]/20'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95'"
        :disabled="loading || profile._id === activeProfileId"
        @click="emit('activate', profile._id)"
      >
        <UIcon v-if="profile._id === activeProfileId" name="lucide:check-circle-2" class="h-4 w-4" />
        {{ profile.name }}
      </button>
    </div>

    <div class="mt-6 flex flex-wrap gap-3">
      <UButton
        color="neutral"
        variant="outline"
        class="bg-white hover:bg-slate-50 text-slate-700 font-semibold shadow-sm"
        type="button"
        icon="lucide:plus"
        :loading="loading"
        @click="emit('create')"
      >
        Nuevo perfil
      </UButton>
      <UButton
        color="neutral"
        variant="ghost"
        class="text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-semibold"
        type="button"
        icon="lucide:trash-2"
        :loading="loading"
        :disabled="!activeProfileId || !canDeleteProfiles"
        @click="emit('deleteActive')"
      >
        Eliminar activo
      </UButton>
    </div>
  </div>
</template>
