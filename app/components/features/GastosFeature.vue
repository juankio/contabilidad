<script setup lang="ts">
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
  <main class="min-h-screen bg-transparent text-slate-900">
    <section class="mx-auto max-w-screen-2xl overflow-x-clip px-4 md:px-6 pb-12 pt-8">
      <div class="grid min-w-0 gap-6 lg:grid-cols-12 items-start">
        <GastosHeader
          class="anim-up min-w-0 lg:col-span-12 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm"
          :exporting="exporting"
          :on-export="exportGastos"
        />

        <p
          v-if="exportError"
          class="text-sm font-medium rounded-xl bg-rose-50 text-rose-600 px-4 py-3 lg:col-span-12"
        >
          {{ exportError }}
        </p>

        <!-- Columna Izquierda: Formulario (Sticky) y Resumen -->
        <div class="flex flex-col gap-6 lg:col-span-4 min-w-0 w-full overflow-hidden">
          <GastoForm
            class="anim-up-1 min-w-0 w-full"
            @saved="handleGastoSaved"
          />

          <GastosProfilesSummary
            class="anim-up-3 min-w-0 w-full"
            :groups="groupedByProfile"
            :pending="groupedPending"
            :error="!!groupedError"
            :format-currency="formatCurrency"
            :format-date="formatShortDate"
          />
        </div>

        <!-- Columna Derecha: Gráficas (Expansivo) -->
        <div class="flex flex-col gap-6 lg:col-span-8 min-w-0 w-full overflow-hidden">
          <StatsCharts class="anim-up-2 min-w-0 w-full h-full" />
        </div>
      </div>
    </section>
  </main>
</template>
