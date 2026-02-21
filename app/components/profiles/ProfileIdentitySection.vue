<script setup lang="ts">
defineProps<{
  profileName: string
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'rename'): void
}>()
</script>

<template>
  <div class="h-full rounded-2xl border border-slate-200 bg-white p-4">
    <div class="flex items-center gap-2 text-slate-700">
      <UIcon
        name="lucide:id-card"
        class="h-4 w-4 "
      />
      <p class="text-sm font-semibold">
        Perfil actual
      </p>
    </div>

    <div class="mt-3  p-3">
      <p class=" text-2xl font-semibold text-slate-900">
        {{ profileName || 'Sin nombre' }}
      </p>
      <p class="mt-2 text-xs text-slate-500">
        Este perfil se usa para registrar y agrupar tus movimientos.
      </p>
    </div>

    <div class="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-xs text-slate-500">
        Te pediremos confirmacion antes de cambiar el nombre.
      </p>
      <UButton
        color="neutral"
        variant="soft"
        class="w-full bg-emerald-100 text-emerald-900 hover:bg-emerald-200 sm:w-auto"
        type="button"
        :disabled="loading"
        @click="emit('rename')"
      >
        Cambiar nombre
      </UButton>
    </div>
  </div>
</template>
