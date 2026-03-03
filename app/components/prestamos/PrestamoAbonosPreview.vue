<script setup lang="ts">
import type { PrestamoAbono } from '../../composables/prestamos/types'

const showAbonosModal = ref(false)

defineProps<{
  abonos: PrestamoAbono[]
  formatCurrency: (value: number) => string
  formatShortDate: (value: string) => string
  borrower?: string
}>()
</script>

<template>
  <div
    v-if="abonos.length"
    class="mt-4 border-t border-slate-200 pt-3"
  >
    <div class="flex items-center justify-between gap-2">
      <p class="text-xs uppercase tracking-[0.12em] text-slate-500">
        Abonos
      </p>
      <UButton
        size="xs"
        color="neutral"
        variant="soft"
        :label="`Ver abonos (${abonos.length})`"
        @click="showAbonosModal = true"
      />
    </div>
  </div>

  <div
    v-if="showAbonosModal"
    class="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"
    @click.self="showAbonosModal = false"
  >
    <div class="w-full max-w-xl rounded-3xl bg-white p-5 shadow-xl">
      <div class="mb-4 flex items-center justify-between gap-3">
        <div class="min-w-0">
          <p class="truncate text-lg font-semibold text-slate-900">
            {{ borrower ? `Abonos de ${borrower}` : 'Abonos registrados' }}
          </p>
          <p class="text-xs text-slate-500">
            {{ abonos.length }} pagos registrados
          </p>
        </div>
        <UButton
          size="xs"
          color="neutral"
          variant="ghost"
          label="Cerrar"
          @click="showAbonosModal = false"
        />
      </div>

      <div class="grid max-h-[65vh] gap-2 overflow-y-auto pr-1">
        <div
          v-for="abono in abonos"
          :key="abono._id"
          class="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2 text-sm"
        >
          <span>{{ formatShortDate(abono.date) }} · {{ abono.note || 'Sin nota' }}</span>
          <strong class="text-emerald-700">{{ formatCurrency(abono.amount) }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>
