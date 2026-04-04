<script setup lang="ts">
import type { PaymentPlan, Prestamo } from '../../composables/prestamos/types'
import PrestamoPendingItem from './PrestamoPendingItem.vue'
import PrestamoAbonoForm from './PrestamoAbonoForm.vue'

defineProps<{
  prestamosPendientes: Prestamo[]
  openAbonoPrestamoId: string | null
  deletingPrestamoId: string
  abonoSaving: boolean
  abonoError: string
  abonoSuccess: string
  formatCurrency: (value: number) => string
  formatShortDate: (value: string) => string
  paymentPlanLabel: (plan: PaymentPlan, installmentsCount: number | null) => string
}>()

const abonoAmountInput = defineModel<string>('abonoAmountInput', { required: true })
const abonoDateValue = defineModel<unknown>('abonoDateValue', { required: true })
const abonoNote = defineModel<string>('abonoNote', { required: true })

const emit = defineEmits<{
  (e: 'toggle-abono', prestamoId: string): void
  (e: 'delete-prestamo', prestamo: Prestamo): void
  (e: 'submit-abono'): void
}>()
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm">
    <div class="flex items-center gap-2 text-slate-700">
      <UIcon
        name="lucide:hand-coins"
        class="h-4 w-4"
      />
      <p class="text-sm font-semibold">
        Prestamos pendientes
      </p>
    </div>
    <h2 class="mt-0.5 text-2xl font-bold text-slate-900">
      Prestamos pendientes
    </h2>
    <p class="mt-1 text-sm text-slate-500">
      Registra abonos hasta completar cada deuda.
    </p>
    <div
      v-if="!prestamosPendientes.length"
      class="mt-4 grid min-h-56 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6"
    >
      <div class="text-center">
        <UIcon
          name="i-lucide-hand-coins"
          class="mx-auto mb-3 text-6xl text-slate-300"
        />
        <p class="text-sm text-slate-500">
          No hay prestamos pendientes
        </p>
      </div>
    </div>
    <div
      v-else
      class="mt-4 grid gap-3"
    >
      <PrestamoPendingItem
        v-for="prestamo in prestamosPendientes"
        :key="prestamo._id"
        :prestamo="prestamo"
        :open-abono-prestamo-id="openAbonoPrestamoId"
        :deleting-prestamo-id="deletingPrestamoId"
        :format-currency="formatCurrency"
        :format-short-date="formatShortDate"
        :payment-plan-label="paymentPlanLabel"
        @toggle-abono="emit('toggle-abono', $event)"
        @delete-prestamo="emit('delete-prestamo', $event)"
      >
        <PrestamoAbonoForm
          v-if="openAbonoPrestamoId === prestamo._id"
          v-model:abono-amount-input="abonoAmountInput"
          v-model:abono-date-value="abonoDateValue"
          v-model:abono-note="abonoNote"
          :abono-saving="abonoSaving"
          :abono-error="abonoError"
          :abono-success="abonoSuccess"
          @submit="emit('submit-abono')"
        />
      </PrestamoPendingItem>
    </div>
  </div>
</template>
