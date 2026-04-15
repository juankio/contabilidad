<script setup lang="ts">
import GastosHeader from '../components/gastos/GastosHeader.vue'
import GastosProfilesSummary from '../components/gastos/GastosProfilesSummary.vue'
import GastoForm from '../components/GastoForm.client.vue'
import StatsCharts from '../components/StatsCharts.vue'
import { useGastos } from '../composables/gastos/useGastos'

const {
  groupedByProfile,
  groupedPending,
  groupedError,
  exporting,
  exportError,
  exportGastos,
  handleGastoSaved,
  formatCurrency,
  formatShortDate
} = useGastos()
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-6xl overflow-x-clip px-4 pb-10 pt-6">
      <div class="grid min-w-0 gap-6 lg:grid-cols-12">
        <GastosHeader
          class="anim-up min-w-0 lg:col-span-12"
          :exporting="exporting"
          :on-export="exportGastos"
        />

        <p
          v-if="exportError"
          class="text-sm text-rose-500 lg:col-span-12"
        >
          {{ exportError }}
        </p>

        <GastoForm
          class="anim-up-1 min-w-0 lg:col-span-4"
          @saved="handleGastoSaved"
        />

        <StatsCharts class="anim-up-2 min-w-0 lg:col-span-8" />

        <GastosProfilesSummary
          class="anim-up-3 min-w-0 lg:col-span-8 lg:col-start-5"
          :groups="groupedByProfile"
          :pending="groupedPending"
          :error="!!groupedError"
          :format-currency="formatCurrency"
          :format-date="formatShortDate"
        />
      </div>
    </section>
  </main>
</template>
