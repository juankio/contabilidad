<script setup lang="ts">
import type { PaymentPlan } from '../../composables/prestamos/types'
import FormField from '../forms/FormField.vue'
import DateInputField from '../forms/DateInputField.vue'

const paymentPlan = defineModel<PaymentPlan | string>('paymentPlan', { required: true })
const installmentsInput = defineModel<string | number>('installmentsInput', { required: true })
const collectionDateValue = defineModel<unknown | null>('collectionDateValue', { required: true })
</script>

<template>
  <FormField
    label="Tipo de cobro"
    for-id="payment-plan"
  >
    <USelect
      id="payment-plan"
      v-model="paymentPlan"
      :items="[
        { label: 'Pago unico', value: 'single' },
        { label: 'Cuotas', value: 'installments' }
      ]"
      size="lg"
      placeholder="Selecciona un tipo de cobro"
      :aria-label="paymentPlan === 'installments' ? 'Cuotas' : 'Pago unico'"
    />
  </FormField>

  <FormField
    v-if="paymentPlan === 'installments'"
    label="Cantidad de cuotas"
    for-id="installments-count"
  >
    <UInput
      id="installments-count"
      v-model="installmentsInput"
      type="text"
      inputmode="numeric"
      placeholder="Ej: 6"
      size="lg"
    />
  </FormField>

  <DateInputField
    label="Fecha de cobro (opcional)"
    for-id="collection-date"
    :model-value="collectionDateValue"
    @update:model-value="collectionDateValue = $event as unknown"
  />

  <UButton
    v-if="collectionDateValue"
    type="button"
    color="neutral"
    variant="ghost"
    size="xs"
    @click="collectionDateValue = null"
  >
    Quitar fecha de cobro
  </UButton>
</template>
