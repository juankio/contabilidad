<script setup lang="ts">
defineProps<{
  open: boolean
  loading: boolean
  error: string
  type: string
  label: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'close'): void
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
            Eliminar
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
