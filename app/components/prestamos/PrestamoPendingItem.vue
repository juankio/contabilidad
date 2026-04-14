<script setup lang="ts">
import type { PaymentPlan, Prestamo } from '../../composables/prestamos/types'
import PrestamoAbonosPreview from './PrestamoAbonosPreview.vue'

const props = defineProps<{
  prestamo: Prestamo
  openAbonoPrestamoId: string | null
  deletingPrestamoId: string
  formatCurrency: (value: number) => string
  formatShortDate: (value: string) => string
  paymentPlanLabel: (plan: PaymentPlan, installmentsCount: number | null) => string
}>()

const emit = defineEmits<{
  (e: 'toggle-abono', prestamoId: string): void
  (e: 'delete-prestamo', prestamo: Prestamo): void
}>()

const cuotasProgress = computed(() => {
  if (props.prestamo.paymentPlan !== 'installments' || !props.prestamo.installmentsCount) {
    return ''
  }
  return `${props.prestamo.abonos.length}/${props.prestamo.installmentsCount} cuotas`
})

const reachedInstallmentsLimit = computed(() =>
  props.prestamo.paymentPlan === 'installments'
  && Boolean(props.prestamo.installmentsCount)
  && props.prestamo.abonos.length >= (props.prestamo.installmentsCount ?? 0)
  && props.prestamo.pendingAmount > 0
)
</script>

<template>
  <div class="rounded-2xl border border-slate-200 p-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p class="text-sm font-semibold text-slate-900">
          {{ prestamo.borrower }}
        </p>
        <p class="mt-1 text-xs text-slate-600">
          {{ prestamo.description || 'Sin descripcion' }} · {{ formatShortDate(prestamo.date) }}
        </p>
        <p class="mt-1 text-xs text-slate-600">
          {{ paymentPlanLabel(prestamo.paymentPlan, prestamo.installmentsCount) }}
          <span v-if="prestamo.collectionDate"> · Cobro: {{ formatShortDate(prestamo.collectionDate) }}</span>
        </p>
        <p
          v-if="cuotasProgress"
          class="mt-1 text-xs text-slate-600"
        >
          {{ cuotasProgress }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          size="xs"
          color="primary"
          variant="soft"
          :label="openAbonoPrestamoId === prestamo._id ? 'Cerrar' : 'Registrar abono'"
          :disabled="reachedInstallmentsLimit"
          @click="emit('toggle-abono', prestamo._id)"
        />
        <UButton
          size="xs"
          color="error"
          variant="ghost"
          :loading="deletingPrestamoId === prestamo._id"
          label="Eliminar"
          @click="emit('delete-prestamo', prestamo)"
        />
      </div>
    </div>
    <div class="mt-3 grid gap-2 text-sm sm:grid-cols-3">
      <p class="rounded-xl bg-slate-100 px-3 py-2">
        Prestado: <strong>{{ formatCurrency(prestamo.amount) }}</strong>
      </p>
      <p class="rounded-xl bg-emerald-50 px-3 py-2 text-emerald-700">
        Abonado: <strong>{{ formatCurrency(prestamo.paidAmount) }}</strong>
      </p>
      <p class="rounded-xl bg-amber-50 px-3 py-2 text-amber-700">
        Pendiente: <strong>{{ formatCurrency(prestamo.pendingAmount) }}</strong>
      </p>
    </div>
    <p
      v-if="reachedInstallmentsLimit"
      class="mt-2 text-xs text-rose-500"
    >
      Limite de cuotas alcanzado. Edita el prestamo si necesitas mas cuotas.
    </p>
    <slot />
    <PrestamoAbonosPreview
      :abonos="prestamo.abonos"
      :borrower="prestamo.borrower"
      :format-currency="formatCurrency"
      :format-short-date="formatShortDate"
    />
  </div>
</template>
