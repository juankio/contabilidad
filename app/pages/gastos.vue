<script setup lang="ts">
import GastosHeader from '../components/gastos/GastosHeader.vue'
import GastosList from '../components/gastos/GastosList.vue'
import GastoForm from '../components/GastoForm.client.vue'
import StatsCharts from '../components/StatsCharts.vue'

const {
  gastos,
  pending,
  error,
  exporting,
  exportError,
  exportGastos,
  handleGastoSaved,
  formatCurrency,
  formatShortDate
} = await useGastos()
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-6xl px-4 pb-10 pt-6">
      <div class="grid gap-6 lg:grid-cols-12">
        <GastosHeader
          :exporting="exporting"
          :on-export="exportGastos"
        />

        <p
          v-if="exportError"
          class="text-sm text-rose-500 lg:col-span-12"
        >
          {{ exportError }}
        </p>

        <GastoForm @saved="handleGastoSaved" />

        <div class="grid gap-6 lg:col-span-8">
          <StatsCharts />

          <GastosList
            :gastos="gastos"
            :pending="pending"
            :error="!!error"
            :format-currency="formatCurrency"
            :format-date="formatShortDate"
          />
        </div>
      </div>
    </section>
  </main>
</template>
