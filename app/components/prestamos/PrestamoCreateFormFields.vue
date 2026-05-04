<script setup lang="ts">
import type { PaymentPlan } from '../../composables/prestamos/types'

const borrower = defineModel<string>('borrower', { required: true })
const amountInput = defineModel<string | number>('amountInput', { required: true })
const paymentPlan = defineModel<PaymentPlan | string>('paymentPlan', { required: true })
const installmentsInput = defineModel<string | number>('installmentsInput', { required: true })
const description = defineModel<string>('description', { required: true })
const loanDateValue = defineModel<unknown>('loanDateValue', { required: true })
const collectionDateValue = defineModel<unknown | null>('collectionDateValue', { required: true })
const note = defineModel<string>('note', { required: true })
</script>

<template>
  <FormField
    label="Persona"
    for-id="borrower"
  >
    <UInput
      id="borrower"
      v-model="borrower"
      type="text"
      maxlength="60"
      placeholder="Ej: Juan Perez"
      size="lg"
    />
  </FormField>
  <FormField
    label="Monto prestado"
    for-id="amount"
  >
    <UInput
      id="amount"
      v-model="amountInput"
      type="text"
      inputmode="numeric"
      placeholder="0"
      size="lg"
    />
  </FormField>
  <PrestamoPaymentPlanFields
    v-model:payment-plan="paymentPlan"
    v-model:installments-input="installmentsInput"
    v-model:collection-date-value="collectionDateValue"
  />
  <details class="rounded-2xl border border-slate-200 bg-transparent/60 px-3 py-2">
    <summary class="cursor-pointer select-none text-sm font-medium text-slate-600">
      Mas opciones (opcional)
    </summary>
    <div class="mt-3 grid gap-4">
      <FormField
        label="Descripcion"
        for-id="description"
      >
        <UInput
          id="description"
          v-model="description"
          type="text"
          maxlength="120"
          placeholder="Ej: Prestamo personal"
          size="lg"
        />
      </FormField>
      <DateInputField
        label="Fecha del prestamo"
        for-id="loan-date"
        :model-value="loanDateValue"
        @update:model-value="loanDateValue = $event as unknown"
      />
      <FormField
        label="Nota"
        for-id="loan-note"
      >
        <UInput
          id="loan-note"
          v-model="note"
          type="text"
          maxlength="160"
          placeholder="Opcional"
          size="lg"
        />
      </FormField>
    </div>
  </details>
</template>
