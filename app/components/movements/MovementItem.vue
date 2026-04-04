<script setup lang="ts">
import { useFormatters } from '../../composables/useFormatters'
import type { MovimientoRow } from '../../composables/movimientos/useMovementCrud'

const props = defineProps<{
  movimiento: MovimientoRow
  showActions?: boolean
}>()

const emit = defineEmits<{
  (e: 'edit' | 'delete', movimiento: MovimientoRow): void
}>()

const { formatCurrency, formatShortDate } = useFormatters()

const isIngreso = props.movimiento.type === 'Ingreso'
</script>

<template>
  <div
    class="group flex items-center gap-3 rounded-2xl border border-slate-100 px-4 py-3 transition-all duration-150 hover:border-slate-200 hover:bg-slate-50"
  >
    <div
      class="h-2 w-2 shrink-0 rounded-full"
      :class="isIngreso ? 'bg-emerald-400' : 'bg-amber-400'"
    />
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-medium text-slate-800 group-hover:text-slate-900">
        {{ movimiento.description }}
      </p>
      <p class="mt-0.5 text-xs text-slate-400">
        {{ movimiento.category }} · {{ formatShortDate(movimiento.date) }}
      </p>
    </div>
    <div class="flex items-center gap-2">
      <p
        class="shrink-0 text-sm font-semibold tabular-nums"
        :class="isIngreso ? 'text-emerald-600' : 'text-amber-600'"
      >
        {{ isIngreso ? '+' : '-' }}{{ formatCurrency(movimiento.amount) }}
      </p>
      <div
        v-if="showActions"
        class="flex items-center gap-1"
      >
        <UButton
          color="neutral"
          variant="soft"
          size="xs"
          icon="lucide:pencil"
          @click="emit('edit', movimiento)"
        >
          Editar
        </UButton>
        <UButton
          color="error"
          variant="soft"
          size="xs"
          icon="lucide:trash-2"
          @click="emit('delete', movimiento)"
        >
          Eliminar
        </UButton>
      </div>
    </div>
  </div>
</template>
