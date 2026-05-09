<script setup lang="ts">
import { animate, stagger } from 'animejs'

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

onMounted(() => {
  if (!import.meta.client) return
  const targets = Array.from(document.querySelectorAll('.anim-up, .anim-up-1, .anim-up-2, .anim-up-3, .anim-up-4'))
  if (targets.length) {
    animate(targets, {
      y: [30, 0],
      opacity: [0, 1],
      duration: 600,
      delay: stagger(100),
      ease: 'outExpo'
    })
  }
})
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

          <div class="flex flex-col sm:flex-row items-center justify-between w-full md:w-auto gap-3 mt-4 md:mt-0">
            <UButton
              color="neutral"
              variant="soft"
              icon="lucide:arrow-left"
              class="rounded-xl px-5 font-medium transition-colors hover:bg-slate-100 w-full sm:w-auto justify-center"
              to="/"
            >
              Volver
            </UButton>
            <div class="flex items-center justify-between w-full md:w-auto gap-3 rounded-2xl bg-emerald-50 px-4 py-2 sm:py-3 border border-emerald-100">
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <UIcon
                    name="lucide:wallet"
                    class="h-4 w-4"
                  />
                </div>
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Balance Actual
                  </p>
                  <p class="text-sm font-extrabold text-slate-900 tabular-nums">
                    <span
                      v-if="saldoDisponible < 0"
                      class="text-rose-500 mr-0.5"
                    >-</span>
                    <span>{{ formatCurrency(Math.abs(saldoDisponible)) }}</span>
                  </p>
                </div>
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
          :amount-input="amountInput"
          :payment-plan="form.paymentPlan"
          :installments-input="installmentsInput"
          :description="form.description"
          :loan-date-value="loanDateValue"
          :collection-date-value="collectionDateValue"
          :note="form.note"
          class="anim-up-2"
          :creating="creating"
          :create-error="createError"
          @update:borrower="emit('update:borrower', $event)"
          :create-success="createSuccess"
          @update:amount-input="emit('update:amountInput', $event)"
          @update:payment-plan="emit('update:paymentPlan', $event)"
          @update:installments-input="emit('update:installmentsInput', $event)"
          @update:description="emit('update:description', $event)"
          @update:loan-date-value="emit('update:loanDateValue', $event)"
          @update:collection-date-value="emit('update:collectionDateValue', $event)"
          @update:note="emit('update:note', $event)"
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
              :abono-date-value="abonoDateValue"
              :abono-note="abonoForm.note"
              class="anim-up-3"
              :prestamos-pendientes="prestamosPendientes"
              :open-abono-prestamo-id="openAbonoPrestamoId"
              :deleting-prestamo-id="deletingPrestamoId"
              :abono-saving="abonoSaving"
              :abono-error="abonoError"
              :abono-success="abonoSuccess"
              :format-currency="formatCurrency"
              @update:abono-amount-input="emit('update:abonoAmountInput', $event)"
              :format-short-date="formatShortDate"
              @update:abono-date-value="emit('update:abonoDateValue', $event)"
              :payment-plan-label="paymentPlanLabel"
              @update:abono-note="emit('update:abonoNote', $event)"
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
      :target="editingTarget"
      :is-editing="isEditing"
      :edit-error="editError"
      @update:form="emit('update:editForm', $event)"
      @cancel="emit('cancelEditing')"
      @submit="emit('submitEdit')"
    />
  </main>
</template>
