<script setup lang="ts">
import PrestamosOverviewCard from '../components/prestamos/PrestamosOverviewCard.vue'
import PrestamoCreateFormCard from '../components/prestamos/PrestamoCreateFormCard.vue'
import PrestamosPendingCard from '../components/prestamos/PrestamosPendingCard.vue'
import PrestamosPaidCard from '../components/prestamos/PrestamosPaidCard.vue'
import PrestamoDeleteModal from '../components/prestamos/PrestamoDeleteModal.vue'
import { usePrestamos } from '../composables/prestamos/usePrestamos'

definePageMeta({
  requiresModule: 'prestamos'
})

const {
  pending, error, summary, prestamosPendientes, prestamosPagados, formatCurrency, formatShortDate,
  form, amountInput, installmentsInput, loanDateValue, collectionDateValue, creating, createError,
  createSuccess, submitPrestamo, openAbonoPrestamoId, deletingPrestamoId, abonoAmountInput, abonoDateValue,
  abonoForm, abonoSaving, abonoError, abonoSuccess, toggleAbonoForm, submitAbono, paymentPlanLabel,
  requestDeletePrestamo, cancelDeletePrestamo, confirmDeletePrestamo, deletingTarget, deleteError
} = usePrestamos()

const { activeProfileName } = useProfile()
const profileInitial = computed(() => activeProfileName.value?.trim().charAt(0).toUpperCase() || 'M')
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-6xl overflow-x-clip px-4 pb-10 pt-6">
      <!-- Page header -->
      <header class="anim-up mb-6 rounded-3xl bg-white p-5 shadow-sm">
        <div class="flex items-center gap-3">
          <div
            class="relative flex h-10 w-10 items-center justify-center rounded-2xl shadow-sm"
            style="background: var(--brand-600)"
          >
            <span class="text-sm font-bold text-white">
              {{ profileInitial }}
            </span>
            <span class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-700">
              <UIcon
                name="lucide:handshake"
                class="h-3 w-3 text-white"
              />
            </span>
          </div>
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
              Módulo
            </p>
            <h1 class="text-lg font-semibold text-slate-900">
              Préstamos
            </h1>
            <p class="text-xs text-slate-400">
              Gestiona lo que prestas y lo que te deben
            </p>
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
          v-model:borrower="form.borrower"
          v-model:amount-input="amountInput"
          v-model:payment-plan="form.paymentPlan"
          v-model:installments-input="installmentsInput"
          v-model:description="form.description"
          v-model:loan-date-value="loanDateValue"
          v-model:collection-date-value="collectionDateValue"
          v-model:note="form.note"
          class="anim-up-2"
          :creating="creating"
          :create-error="createError"
          :create-success="createSuccess"
          @submit="submitPrestamo"
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
              v-model:abono-amount-input="abonoAmountInput"
              v-model:abono-date-value="abonoDateValue"
              v-model:abono-note="abonoForm.note"
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
              @toggle-abono="toggleAbonoForm"
              @delete-prestamo="requestDeletePrestamo"
              @submit-abono="submitAbono"
            />
            <PrestamosPaidCard
              class="anim-up-4"
              :prestamos-pagados="prestamosPagados"
              :format-currency="formatCurrency"
              :format-short-date="formatShortDate"
              :payment-plan-label="paymentPlanLabel"
            />
          </template>
        </div>
      </div>
    </section>
    <PrestamoDeleteModal
      :target="deletingTarget"
      :deleting-prestamo-id="deletingPrestamoId"
      :delete-error="deleteError"
      @cancel="cancelDeletePrestamo"
      @confirm="confirmDeletePrestamo"
    />
  </main>
</template>
