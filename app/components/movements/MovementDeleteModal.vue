<script setup lang="ts">
defineProps<{
  open: boolean
  loading: boolean
  error: string
  type: string | null
  label: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <Transition name="modal">
    <div
      v-if="open"
      class="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-sm"
      @click.self="emit('update:open', false)"
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
            :disabled="loading"
            @click="emit('update:open', false)"
          />
        </div>

        <p class="mt-2 text-sm text-rose-600">
          Esta acción no se puede deshacer. ¿Seguro que deseas eliminar "{{ label }}"?
        </p>

        <p
          v-if="error"
          class="mt-3 text-sm text-rose-500 font-bold"
        >
          {{ error }}
        </p>

        <div class="mt-4 flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :disabled="loading"
            @click="emit('update:open', false)"
          >
            Cancelar
          </UButton>
          <UButton
            color="error"
            :loading="loading"
            @click="emit('confirm')"
          >
            Si, eliminar
          </UButton>
        </div>
      </div>
    </div>
  </Transition>
</template>
