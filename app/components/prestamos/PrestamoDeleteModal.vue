<script setup lang="ts">
import type { Prestamo } from '../../composables/prestamos/types'

defineProps<{
  target: Prestamo | null
  deletingPrestamoId: string | null
  deleteError: any
}>()

const emit = defineEmits<{
  (e: 'cancel' | 'confirm'): void
}>()
</script>

<template>
  <div
    v-if="target"
    class="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"
    @click.self="emit('cancel')"
  >
    <div class="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
      <h3 class="text-lg font-bold tracking-tight tracking-tight text-slate-900">
        Eliminar prestamo
      </h3>
      <p class="mt-2 text-sm text-slate-600">
        Vas a eliminar el prestamo de <strong>{{ target.borrower }}</strong>. Esta accion no se puede deshacer.
      </p>
      <p
        v-if="deleteError"
        class="mt-3 text-sm text-rose-500"
      >
        {{ deleteError }}
      </p>
      <div class="mt-5 flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          label="Cancelar"
          :disabled="deletingPrestamoId === target._id"
          @click="emit('cancel')"
        />
        <UButton
          color="error"
          variant="soft"
          :label="deletingPrestamoId === target._id ? 'Eliminando...' : 'Eliminar'"
          :loading="deletingPrestamoId === target._id"
          @click="emit('confirm')"
        />
      </div>
    </div>
  </div>
</template>
