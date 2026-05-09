<script setup lang="ts">
const {
  pending, error, summary, prestamosPendientes, prestamosPagados, formatCurrency, formatShortDate,
  form, amountInput, installmentsInput, loanDateValue, collectionDateValue, creating, createError,
  createSuccess, submitPrestamo, openAbonoPrestamoId, deletingPrestamoId, abonoAmountInput, abonoDateValue,
  abonoForm, abonoSaving, abonoError, abonoSuccess, toggleAbonoForm, submitAbono, paymentPlanLabel,
  requestDeletePrestamo, cancelDeletePrestamo, confirmDeletePrestamo, deletingTarget, deleteError,
  isEditing, editError, editSuccess, editingTarget, editForm, startEditing, cancelEditing, submitEdit
} = usePrestamos()

const toast = useToast()

watch(editSuccess, (val) => {
  if (val) {
    toast.add({
      title: 'Éxito',
      description: val,
      color: 'success',
      icon: 'lucide:check-circle'
    })
  }
})

const { resumen } = useResumen()
const saldoDisponible = computed(() => resumen.value?.saldoDisponible ?? resumen.value?.saldo ?? 0)

const { activeProfileName } = useProfile()
const profileInitial = computed(() => activeProfileName.value?.trim().charAt(0).toUpperCase() || 'M')
</script>

<template>
  <PrestamosDashboard
    :pending="pending"
    :error="error"
    :summary="summary"
    :prestamos-pendientes="prestamosPendientes"
    :prestamos-pagados="prestamosPagados"
    :format-currency="formatCurrency"
    :format-short-date="formatShortDate"
    :form="form"
    :amount-input="amountInput"
    :installments-input="installmentsInput"
    :loan-date-value="loanDateValue"
    :collection-date-value="collectionDateValue"
    :creating="creating"
    :create-error="createError"
    :create-success="createSuccess"
    @update:borrower="form.borrower = $event"
    :open-abono-prestamo-id="openAbonoPrestamoId"
    @update:payment-plan="form.paymentPlan = $event"
    :deleting-prestamo-id="deletingPrestamoId"
    @update:description="form.description = $event"
    :abono-amount-input="abonoAmountInput"
    @update:note="form.note = $event"
    :abono-date-value="abonoDateValue"
    @update:amount-input="amountInput = $event"
    :abono-form="abonoForm"
    @update:installments-input="installmentsInput = $event"
    :abono-saving="abonoSaving"
    @update:loan-date-value="loanDateValue = $event"
    :abono-error="abonoError"
    @update:collection-date-value="collectionDateValue = $event"
    :abono-success="abonoSuccess"
    :payment-plan-label="paymentPlanLabel"
    :deleting-target="deletingTarget"
    :delete-error="deleteError"
    :is-editing="isEditing"
    :edit-error="editError"
    @update:abono-amount-input="abonoAmountInput = $event"
    :editing-target="editingTarget"
    @update:abono-date-value="abonoDateValue = $event"
    :edit-form="editForm"
    @update:abono-note="abonoForm.note = $event"
    :saldo-disponible="saldoDisponible"
    :profile-initial="profileInitial"
    @update:edit-form="editForm = $event"
    @submit-prestamo="submitPrestamo"
    @toggle-abono-form="toggleAbonoForm"
    @submit-abono="submitAbono"
    @request-delete-prestamo="requestDeletePrestamo"
    @cancel-delete-prestamo="cancelDeletePrestamo"
    @confirm-delete-prestamo="confirmDeletePrestamo"
    @start-editing="startEditing"
    @cancel-editing="cancelEditing"
    @submit-edit="submitEdit"
  />
</template>
