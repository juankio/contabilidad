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
    :open-abono-prestamo-id="openAbonoPrestamoId"
    :deleting-prestamo-id="deletingPrestamoId"
    :abono-amount-input="abonoAmountInput"
    :abono-date-value="abonoDateValue"
    :abono-form="abonoForm"
    :abono-saving="abonoSaving"
    :abono-error="abonoError"
    :abono-success="abonoSuccess"
    :payment-plan-label="paymentPlanLabel"
    :deleting-target="deletingTarget"
    :delete-error="deleteError"
    :is-editing="isEditing"
    :edit-error="editError"
    :editing-target="editingTarget"
    :edit-form="editForm"
    :saldo-disponible="saldoDisponible"
    :profile-initial="profileInitial"
    @update:borrower="form.borrower = $event"
    @update:payment-plan="form.paymentPlan = $event"
    @update:description="form.description = $event"
    @update:note="form.note = $event"
    @update:amount-input="amountInput = $event"
    @update:installments-input="installmentsInput = $event"
    @update:loan-date-value="loanDateValue = $event"
    @update:collection-date-value="collectionDateValue = $event"
    @update:abono-amount-input="abonoAmountInput = $event"
    @update:abono-date-value="abonoDateValue = $event"
    @update:abono-note="abonoForm.note = $event"
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
