<script setup lang="ts">
import type { PaymentPlan, Prestamo } from '../../composables/prestamos/types'
import PrestamoAbonosPreview from './PrestamoAbonosPreview.vue'

defineProps<{
  prestamosPagados: Prestamo[]
  formatCurrency: (value: number) => string
  formatShortDate: (value: string) => string
  paymentPlanLabel: (plan: PaymentPlan, installmentsCount: number | null) => string
}>()
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm">
    <div class="flex items-center gap-2 text-slate-700">
      <UIcon
        name="lucide:circle-check-big"
        class="h-4 w-4"
      />
      <p class="text-sm font-semibold">
        Prestamos pagados
      </p>
    </div>
    <h2 class="mt-0.5 text-2xl font-bold text-slate-900">
      Prestamos pagados
    </h2>
    <div
      v-if="!prestamosPagados.length"
      class="mt-4 grid min-h-56 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6"
    >
      <div class="text-center">
        <UIcon
          name="i-lucide-circle-check-big"
          class="mx-auto mb-3 text-6xl text-slate-300"
        />
        <p class="text-sm text-slate-500">
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
            <span class="font-medium text-slate-900">
              {{ prestamo.borrower }}
            </span>
            <p class="text-xs text-slate-600">
              {{ paymentPlanLabel(prestamo.paymentPlan, prestamo.installmentsCount) }}
              <span v-if="prestamo.collectionDate"> · Cobro: {{ formatShortDate(prestamo.collectionDate) }}</span>
            </p>
          </div>
          <span class="text-slate-500">{{ formatShortDate(prestamo.date) }}</span>
          <span class="text-emerald-700">Pagado {{ formatCurrency(prestamo.amount) }}</span>
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
