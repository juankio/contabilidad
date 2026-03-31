<script setup lang="ts">
import type { PlanCompra } from '../../composables/planeador/usePlaneador'

const props = defineProps<{
  planes: PlanCompra[]
  saldoDisponible: number
  formatCurrency: (v: number) => string
}>()

const pendientes = computed(() => props.planes.filter(p => !p.completado))
const totalPendiente = computed(() => pendientes.value.reduce((acc, p) => acc + p.monto, 0))
const saldoTrasPlan = computed(() => props.saldoDisponible - totalPendiente.value)
const porcentajeUsado = computed(() => {
  if (props.saldoDisponible <= 0) return 100
  return Math.min(100, Math.round((totalPendiente.value / props.saldoDisponible) * 100))
})
const alerta = computed(() => {
  if (saldoTrasPlan.value < 0) return 'critical'
  if (porcentajeUsado.value >= 80) return 'warning'
  return 'ok'
})

const alertaConfig = computed(() => ({
  critical: { badge: 'bg-rose-50 text-rose-600', bar: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50', label: '⚠ Sin fondos' },
  warning:  { badge: 'bg-amber-50 text-amber-600', bar: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-50', label: '⚡ Ajustado' },
  ok:       { badge: 'bg-emerald-50 text-emerald-600', bar: 'bg-emerald-400', text: 'text-emerald-700', bg: 'bg-emerald-50', label: '✓ Bien' }
}[alerta.value]))
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm">
    <!-- Header -->
    <div class="anim-up flex items-start justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
          Impacto en presupuesto
        </p>
        <h2 class="mt-1 text-lg font-semibold text-slate-900">
          Vista general
        </h2>
      </div>
      <div
        class="rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300"
        :class="alertaConfig.badge"
      >
        {{ alertaConfig.label }}
      </div>
    </div>

    <div class="mt-4 space-y-3">
      <!-- Saldo disponible -->
      <div class="anim-up-1 rounded-2xl bg-slate-900 px-4 py-3 text-white">
        <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
          Saldo disponible
        </p>
        <p class="mt-1 text-xl font-semibold tabular-nums">
          {{ formatCurrency(saldoDisponible) }}
        </p>
      </div>

      <!-- Planeado pendiente -->
      <div
        class="anim-up-2 rounded-2xl px-4 py-3"
        style="background: var(--brand-50)"
      >
        <p
          class="text-xs uppercase tracking-[0.2em]"
          style="color: var(--brand-600)"
        >
          Planeado pendiente
        </p>
        <p
          class="mt-1 text-xl font-semibold tabular-nums"
          style="color: var(--brand-700)"
        >
          {{ formatCurrency(totalPendiente) }}
        </p>
        <p
          class="mt-0.5 text-xs"
          style="color: var(--brand-400)"
        >
          {{ pendientes.length }} compra{{ pendientes.length !== 1 ? 's' : '' }} por hacer
        </p>
      </div>

      <!-- Barra de uso -->
      <div class="anim-up-3 rounded-2xl border border-slate-100 px-4 py-3">
        <div class="mb-2.5 flex items-center justify-between">
          <p class="text-xs text-slate-400">
            Uso del presupuesto
          </p>
          <p
            class="text-xs font-semibold transition-colors duration-300"
            :class="alertaConfig.text"
          >
            {{ porcentajeUsado }}%
          </p>
        </div>
        <div class="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            class="anim-bar h-full rounded-full transition-all duration-700"
            :class="alertaConfig.bar"
            :style="{ width: `${porcentajeUsado}%` }"
          />
        </div>
      </div>

      <!-- Saldo resultante -->
      <div
        class="anim-up-4 rounded-2xl px-4 py-3 transition-colors duration-500"
        :class="alertaConfig.bg"
      >
        <p
          class="text-xs uppercase tracking-[0.2em] transition-colors duration-300"
          :class="alertaConfig.text"
        >
          Quedaría disponible
        </p>
        <p
          class="mt-1 text-xl font-semibold tabular-nums transition-colors duration-300"
          :class="alertaConfig.text"
        >
          {{ formatCurrency(saldoTrasPlan) }}
        </p>
        <p
          v-if="saldoTrasPlan < 0"
          class="mt-1 text-xs text-rose-500"
        >
          Te faltarían {{ formatCurrency(Math.abs(saldoTrasPlan)) }} para cumplirlo todo.
        </p>
      </div>
    </div>
  </div>
</template>
