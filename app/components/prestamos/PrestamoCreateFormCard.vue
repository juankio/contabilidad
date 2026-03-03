<script setup lang="ts">
import type { PaymentPlan } from '../../composables/prestamos/types'
import PrestamoCreateFormFields from './PrestamoCreateFormFields.vue'

defineProps<{
  creating: boolean
  createError: string
  createSuccess: string
}>()

const borrower = defineModel<string>('borrower', { required: true })
const amountInput = defineModel<string>('amountInput', { required: true })
const paymentPlan = defineModel<PaymentPlan>('paymentPlan', { required: true })
const installmentsInput = defineModel<string>('installmentsInput', { required: true })
const description = defineModel<string>('description', { required: true })
const loanDateValue = defineModel<unknown>('loanDateValue', { required: true })
const collectionDateValue = defineModel<unknown | null>('collectionDateValue', { required: true })
const note = defineModel<string>('note', { required: true })

const emit = defineEmits<{ (e: 'submit'): void }>()
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm lg:col-span-4">
    <h2 class="text-lg font-semibold">
      Nuevo prestamo
    </h2>
    <p class="mt-1 text-sm text-slate-500">
      Guarda el monto que prestaste y controla su devolucion.
    </p>
    <form
      class="mt-5 grid gap-4"
      @submit.prevent="emit('submit')"
    >
      <PrestamoCreateFormFields
        v-model:borrower="borrower"
        v-model:amount-input="amountInput"
        v-model:payment-plan="paymentPlan"
        v-model:installments-input="installmentsInput"
        v-model:description="description"
        v-model:loan-date-value="loanDateValue"
        v-model:collection-date-value="collectionDateValue"
        v-model:note="note"
      />
      <p
        v-if="createError"
        class="text-sm text-rose-500"
      >
        {{ createError }}
      </p>
      <p
        v-if="createSuccess"
        class="text-sm text-emerald-600"
      >
        {{ createSuccess }}
      </p>
      <UButton
        type="submit"
        size="lg"
        color="success"
        block
        :loading="creating"
      >
        {{ creating ? 'Guardando...' : 'Guardar prestamo' }}
      </UButton>
    </form>
  </div>
</template>
