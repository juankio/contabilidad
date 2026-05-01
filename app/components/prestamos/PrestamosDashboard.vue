<script setup lang="ts">
import PrestamosOverviewCard from './PrestamosOverviewCard.vue'
import PrestamoCreateFormCard from './PrestamoCreateFormCard.vue'
import PrestamosPendingCard from './PrestamosPendingCard.vue'
import PrestamosPaidCard from './PrestamosPaidCard.vue'
import PrestamoDeleteModal from './PrestamoDeleteModal.vue'
import PrestamoEditModal from './PrestamoEditModal.vue'

defineProps<{
  pending: boolean
  error: any
  summary: any
  prestamosPendientes: any[]
  prestamosPagados: any[]
  formatCurrency: (value: number) => string
  formatShortDate: (date: string | Date) => string
  form: any
  amountInput: string | number
  installmentsInput: string | number
  loanDateValue: any
  collectionDateValue: any
  creating: boolean
  createError: any
  createSuccess: any
  openAbonoPrestamoId: string | null
  deletingPrestamoId: string | null
  abonoAmountInput: string | number
  abonoDateValue: any
  abonoForm: any
  abonoSaving: boolean
  abonoError: any
  abonoSuccess: any
  paymentPlanLabel: (plan: any, installmentsCount?: any) => string
  deletingTarget: any
  deleteError: any
  isEditing: boolean
  editError: any
  editingTarget: any
  editForm: any
  saldoDisponible: number
  profileInitial: string
}>()

const emit = defineEmits([
  'update:borrower', 'update:amountInput', 'update:paymentPlan', 'update:installmentsInput',
  'update:description', 'update:loanDateValue', 'update:collectionDateValue', 'update:note',
  'update:abonoAmountInput', 'update:abonoDateValue', 'update:abonoNote', 'update:editForm',
  'submitPrestamo', 'toggleAbonoForm', 'submitAbono', 'requestDeletePrestamo', 'cancelDeletePrestamo',
  'confirmDeletePrestamo', 'startEditing', 'cancelEditing', 'submitEdit'
])
</script>

<template>
  <main class="min-h-screen bg-transparent text-slate-900">
    <section class="mx-auto max-w-screen-2xl overflow-x-clip px-4 pb-10 pt-6">
      <header class="anim-up mb-6 rounded-3xl bg-white p-5 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4 sm:gap-5">
            <div class="relative shrink-0">
              <div class="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-[var(--brand-500)] to-[var(--brand-600)] shadow-sm">
                <UIcon
                  name="lucide:handshake"
                  class="h-6 w-6 sm:h-7 sm:w-7 text-white"
                />
              </div>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Módulo
              </p>
              <h1 class="text-2xl font-bold tracking-tight text-slate-900">
                Préstamos
              </h1>
              <p class="text-xs text-slate-400">
                Gestiona lo que prestas y lo que te deben
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between w-full md:w-auto gap-3 rounded-2xl bg-emerald-50 px-4 py-2 sm:py-3 border border-emerald-100 mt-4 md:mt-0">
            <div class="flex items-center gap-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <UIcon
                  name="lucide:wallet"
                  class="h-4 w-4"
                />
              </div>
              <div>
                <p class="text-xs text-emerald-600 font-medium">
                  Disponible para prestar
                </p>
                <p class="text-lg font-bold text-emerald-700">
                  {{ formatCurrency(saldoDisponible) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="grid min-w-0 gap-6 lg:grid-cols-12">
        <PrestamosOverviewCard
          class="anim-up-1"
          :summary="summary"
          :format-currency="formatCurrency"
        />
        <PrestamoCreateFormCard
          :borrower="form.borrower"
          @update:borrower="emit('update:borrower', $event)"
          :amount-input="amountInput"
          @update:amount-input="emit('update:amountInput', $event)"
          :payment-plan="form.paymentPlan"
          @update:payment-plan="emit('update:paymentPlan', $event)"
          :installments-input="installmentsInput"
          @update:installments-input="emit('update:installmentsInput', $event)"
          :description="form.description"
          @update:description="emit('update:description', $event)"
          :loan-date-value="loanDateValue"
          @update:loan-date-value="emit('update:loanDateValue', $event)"
          :collection-date-value="collectionDateValue"
          @update:collection-date-value="emit('update:collectionDateValue', $event)"
          :note="form.note"
          @update:note="emit('update:note', $event)"
          class="anim-up-2"
          :creating="creating"
          :create-error="createError"
          :create-success="createSuccess"
          @submit="emit('submitPrestamo')"
        />
        <div class="grid gap-6 lg:col-span-8">
          <div
            v-if="pending"
            class="anim-up-3 rounded-2xl bg-white p-4 text-sm text-slate-500 shadow-sm"
          >
            Cargando prestamos...
          </div>
          <div
            v-else-if="error"
            class="anim-up-3 rounded-2xl bg-white p-4 text-sm text-rose-500 shadow-sm"
          >
            No se pudieron cargar los prestamos.
          </div>
          <template v-else>
            <PrestamosPendingCard
              :abono-amount-input="abonoAmountInput"
              @update:abono-amount-input="emit('update:abonoAmountInput', $event)"
              :abono-date-value="abonoDateValue"
              @update:abono-date-value="emit('update:abonoDateValue', $event)"
              :abono-note="abonoForm.note"
              @update:abono-note="emit('update:abonoNote', $event)"
              class="anim-up-3"
              :prestamos-pendientes="prestamosPendientes"
              :open-abono-prestamo-id="openAbonoPrestamoId"
              :deleting-prestamo-id="deletingPrestamoId"
              :abono-saving="abonoSaving"
              :abono-error="abonoError"
              :abono-success="abonoSuccess"
              :format-currency="formatCurrency"
              :format-short-date="formatShortDate"
              :payment-plan-label="paymentPlanLabel"
              @toggle-abono="emit('toggleAbonoForm', $event)"
              @delete-prestamo="emit('requestDeletePrestamo', $event)"
              @submit-abono="emit('submitAbono', $event)"
              @edit-prestamo="emit('startEditing', $event)"
            />
            <PrestamosPaidCard
              class="anim-up-4"
              :prestamos-pagados="prestamosPagados"
              :format-currency="formatCurrency"
              :format-short-date="formatShortDate"
              :payment-plan-label="paymentPlanLabel"
              @edit-prestamo="emit('startEditing', $event)"
            />
          </template>
        </div>
      </div>
    </section>
    <PrestamoDeleteModal
      :target="deletingTarget"
      :deleting-prestamo-id="deletingPrestamoId"
      :delete-error="deleteError"
      @cancel="emit('cancelDeletePrestamo')"
      @confirm="emit('confirmDeletePrestamo')"
    />
    <PrestamoEditModal
      :form="editForm"
      @update:form="emit('update:editForm', $event)"
      :target="editingTarget"
      :is-editing="isEditing"
      :edit-error="editError"
      @cancel="emit('cancelEditing')"
      @submit="emit('submitEdit')"
    />
  </main>
</template>
