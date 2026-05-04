<script setup lang="ts">

const { activePostre, activePostreCost, activePostreProfit } = usePostres()
const { formatCurrency } = useFormatters()
</script>

<template>
  <div v-if="activePostre" class="mt-6 flex items-center justify-between rounded-2xl border border-slate-200/60 bg-transparent px-4 py-3">
    <div>
      <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Costo Total Producción</p>
      <p class="text-lg font-extrabold text-slate-900">{{ formatCurrency(activePostreCost) }}</p>
    </div>
    <div class="text-right">
      <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Margen / Ganancia</p>
      <p class="text-sm font-extrabold" :class="activePostreProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'">
        {{ formatCurrency(activePostreProfit) }}
      </p>
    </div>
  </div>
</template>