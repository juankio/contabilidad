<script setup lang="ts">
defineProps<{
  open: boolean
  loading: boolean
  name: string
}>()

const emit = defineEmits<{
  (e: 'update:name', value: string): void
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
        Cambiar nombre del perfil
      </h3>
      <p class="mt-1 text-sm text-slate-600">
        Confirma el nuevo nombre del perfil activo.
      </p>

      <div class="mt-4">
        <UInput
          :model-value="name"
          type="text"
          size="lg"
          maxlength="32"
          placeholder="Nuevo nombre del perfil"
          autofocus
          @update:model-value="emit('update:name', String($event ?? ''))"
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
          color="neutral"
          type="button"
          :disabled="name.trim().length < 2 || name.trim().length > 32"
          @click="emit('confirm')"
        >
          Usar este nombre
        </UButton>
      </div>
    </div>
  </div>
</template>
