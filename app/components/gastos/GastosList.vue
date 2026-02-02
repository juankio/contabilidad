<script setup lang="ts">
type Gasto = {
  _id: string
  description: string
  category: string
  amount: number
  date: string
}

defineProps<{
  gastos: Gasto[] | null | undefined
  pending: boolean
  error: boolean
  formatCurrency: (value: number) => string
  formatDate: (value: string) => string
}>()
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm">
    <div class="grid gap-3 md:grid-cols-2">
      <div
        v-if="pending"
        class="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500 md:col-span-2"
      >
        Cargando gastos...
      </div>
      <div
        v-else-if="error"
        class="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-500 md:col-span-2"
      >
        No se pudieron cargar los gastos. Revisa la conexion al backend.
      </div>
      <div
        v-else-if="!gastos?.length"
        class="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500 md:col-span-2"
      >
        Aun no hay gastos registrados.
      </div>
      <template v-else>
        <div
          v-for="gasto in gastos"
          :key="gasto._id"
          class="rounded-2xl border border-slate-100 px-4 py-3"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold">
                {{ gasto.description }}
              </p>
              <p class="text-xs text-slate-400">
                {{ gasto.category }} · {{ formatDate(gasto.date) }}
              </p>
            </div>
            <p class="text-sm font-semibold text-amber-600">
              -{{ formatCurrency(gasto.amount) }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
