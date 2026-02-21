<script setup lang="ts">
defineProps<{
  open: boolean
  loading: boolean
  canDeleteProfiles: boolean
  profileName: string
  confirmInput: string
}>()

const emit = defineEmits<{
  (e: 'update:confirmInput', value: string): void
  (e: 'close' | 'confirm'): void
}>()
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"
    @click.self="emit('close')"
  >
    <div class="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
      <h3 class="text-lg font-semibold text-slate-900">
        Eliminar perfil
      </h3>
      <p class="mt-2 text-sm text-rose-600">
        Si eliminas este perfil, se borraran sus datos y no se pueden recuperar.
      </p>
      <p class="mt-3 text-sm text-slate-600">
        Para confirmar, escribe el nombre del perfil:
        <span class="font-semibold text-slate-900">{{ profileName || '-' }}</span>
      </p>

      <div class="mt-3">
        <UInput
          :model-value="confirmInput"
          type="text"
          size="lg"
          :placeholder="profileName || 'Nombre del perfil'"
          autofocus
          @update:model-value="emit('update:confirmInput', String($event ?? ''))"
        />
      </div>

      <div class="mt-5 flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          type="button"
          :disabled="loading"
          @click="emit('close')"
        >
          Cancelar
        </UButton>
        <UButton
          color="error"
          type="button"
          :loading="loading"
          :disabled="!profileName || !canDeleteProfiles || confirmInput.trim() !== profileName.trim()"
          @click="emit('confirm')"
        >
          Eliminar definitivamente
        </UButton>
      </div>
    </div>
  </div>
</template>
