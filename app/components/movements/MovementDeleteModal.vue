<script setup lang="ts">
defineProps<{
  open: boolean
  type: 'Gasto' | 'Ingreso' | null
  label: string
  loading: boolean
  error: string
}>()

const emit = defineEmits<{
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
        Eliminar {{ type?.toLocaleLowerCase() || 'movimiento' }}
      </h3>
      <p class="mt-2 text-sm text-rose-600">
        Esta accion no se puede deshacer.
      </p>
      <p class="mt-2 text-sm text-slate-600">
        Movimiento: <span class="font-semibold text-slate-900">{{ label || '-' }}</span>
      </p>

      <p
        v-if="error"
        class="mt-3 text-sm text-rose-500"
      >
        {{ error }}
      </p>

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
          @click="emit('confirm')"
        >
          Eliminar
        </UButton>
      </div>
    </div>
  </div>
</template>
