<script setup lang="ts">
import type { PaymentPlan, Prestamo } from '../../composables/prestamos/types'
import PrestamoAbonosPreview from './PrestamoAbonosPreview.vue'

defineProps<{
  prestamosPagados: Prestamo[]
  formatCurrency: (value: number) => string
  formatShortDate: (value: string) => string
  paymentPlanLabel: (plan: PaymentPlan, installmentsCount: number | null) => string
}>()

const emit = defineEmits<{
  (e: 'edit-prestamo', prestamo: Prestamo): void
}>()
</script>

<template>
  <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
          <UIcon
            name="lucide:circle-check-big"
            class="h-5 w-5"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Prestamos pagados
          </h2>
          <p class="text-sm text-slate-500">
            Historial de prestamos recuperados.
          </p>
        </div>
      </div>
    </div>
    <div
      v-if="!prestamosPagados.length"
      class="mt-4 grid min-h-56 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6"
    >
      <div class="text-center">
        <UIcon
          name="i-lucide-circle-check-big"
          class="mx-auto mb-3 text-6xl text-slate-300"
        />
        <p class="text-sm font-medium text-slate-500">
          No hay prestamos pagados
        </p>
      </div>
    </div>
    <div
      v-else
      class="mt-4 grid gap-2"
    >
      <div
        v-for="prestamo in prestamosPagados"
        :key="prestamo._id"
        class="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span class="font-semibold text-slate-900">
              {{ prestamo.borrower }}
            </span>
            <p class="text-xs text-slate-600">
              {{ paymentPlanLabel(prestamo.paymentPlan, prestamo.installmentsCount) }}
              <span v-if="prestamo.collectionDate"> · Cobro: {{ formatShortDate(prestamo.collectionDate) }}</span>
            </p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-slate-500">{{ formatShortDate(prestamo.date) }}</span>
            <span class="text-emerald-700">Pagado {{ formatCurrency(prestamo.amount) }}</span>
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              icon="lucide:pencil"
              @click="emit('edit-prestamo', prestamo)"
            />
          </div>
        </div>
        <PrestamoAbonosPreview
          :abonos="prestamo.abonos"
          :borrower="prestamo.borrower"
          :format-currency="formatCurrency"
          :format-short-date="formatShortDate"
        />
      </div>
    </div>
  </div>
</template>
