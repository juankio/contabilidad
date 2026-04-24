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
  (e: 'update:open', value: boolean): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <Transition name="modal">
    <div
      v-if="open"
      class="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-sm"
      @click.self="emit('update:open', false); emit('close')"
    >
      <div class="anim-scale w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
        <div class="mb-4 flex items-center justify-between">
          <p class="text-base font-semibold text-slate-900">
            Eliminar perfil
          </p>
          <UButton
            color="neutral"
            variant="ghost"
            icon="lucide:x"
            size="sm"
            @click="emit('update:open', false); emit('close')"
          >
    <div class="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
      <h3 class="text-2xl font-bold tracking-tight text-slate-900">
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
