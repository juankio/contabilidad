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
  <div class="h-full rounded-2xl bg-white border border-slate-200 bg-slate-50/70 p-4">
    <div class="flex items-center gap-2 text-slate-700">
      <UIcon
        name="lucide:users"
        class="h-4 w-4"
      />
      <p class="text-sm font-semibold">
        Perfiles contables
      </p>
    </div>

    <div class="mt-3 flex flex-wrap gap-2">
      <button
        v-for="profile in profiles"
        :key="profile._id"
        type="button"
        class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-colors"
        :class="profile._id === activeProfileId
          ? 'border-emerald-200 bg-emerald-100 text-emerald-900'
          : 'border-slate-200 bg-white/80 text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800'"
        :disabled="loading || profile._id === activeProfileId"
        @click="emit('activate', profile._id)"
      >
        {{ profile.name }}
        <span
          v-if="profile._id === activeProfileId"
          class="font-semibold text-emerald-700"
        >
          Activo
        </span>
      </button>
    </div>

    <div class="mt-3 flex flex-wrap gap-2">
      <UButton
        color="neutral"
        variant="soft"
        class="bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
        type="button"
        :loading="loading"
        @click="emit('create')"
      >
        Crear perfil
      </UButton>
      <UButton
        color="neutral"
        variant="soft"
        class="border border-rose-200 bg-rose-100 text-rose-700 hover:bg-rose-200"
        type="button"
        :loading="loading"
        :disabled="!activeProfileId || !canDeleteProfiles"
        @click="emit('deleteActive')"
      >
        Eliminar perfil
      </UButton>
    </div>

    <p class="mt-2 text-xs text-slate-500">
      Antes de crear o eliminar, te pediremos confirmacion.
    </p>
    <p
      v-if="!canDeleteProfiles"
      class="mt-1 text-xs text-slate-400"
    >
      Debes mantener al menos un perfil.
    </p>
  </div>
</template>
