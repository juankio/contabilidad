<script setup lang="ts">
import type { MovimientoRow } from '../../composables/movimientos/useMovementCrud'

defineProps<{
  open: boolean
  movimientos: MovimientoRow[] | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'edit' | 'delete', movimiento: MovimientoRow): void
}>()
</script>

<template>
  <Transition name="modal">
    <div
      v-if="open"
      class="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-sm"
      @click.self="emit('update:open', false)"
    >
      <div class="anim-scale w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <p class="text-base font-semibold text-slate-900">
              Todos los movimientos
            </p>
            <p class="mt-0.5 text-xs text-slate-400">
              {{ movimientos?.length ?? 0 }} registros
            </p>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="lucide:x"
            size="sm"
            @click="emit('update:open', false)"
          >
            Cerrar
          </UButton>
        </div>

        <div class="max-h-[65vh] space-y-2 overflow-y-auto pr-1">
          <MovementItem
            v-for="mov in movimientos || []"
            :key="mov._id"
            :movimiento="mov"
            show-actions
            @edit="emit('edit', $event)"
            @delete="emit('delete', $event)"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active { transition: opacity 0.2s ease; }
.modal-leave-active { transition: opacity 0.15s ease; }
.modal-enter-from,
.modal-leave-to     { opacity: 0; }
</style>
