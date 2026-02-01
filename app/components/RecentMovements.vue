<script setup lang="ts">
type Movimiento = {
  _id: string,
  type: 'Gasto' | 'Ingreso',
  description: string,
  category: string,
  amount: number,
  date: string,
}

const { data: movimientos, pending, error } = await useFetch<Movimiento[]>('/api/movimientos', {
  key: 'movimientos'
})

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0
  }).format(value)

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short'
  }).format(new Date(value))
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm md:col-span-2 lg:col-span-2">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">
        Ultimos movimientos
      </h2>
      <button class="text-xs font-semibold text-emerald-600">
        Ver todos
      </button>
    </div>

    <div class="mt-4 grid gap-3">
      <div v-if="pending" class="rounded-2xl border border-slate-100 px-4 py-3 text-sm text-slate-500">
        Cargando movimientos...
      </div>
      <div v-else-if="error" class="rounded-2xl border border-rose-100 px-4 py-3 text-sm text-rose-500">
        No se pudieron cargar los movimientos.
      </div>
      <div
        v-else-if="!movimientos?.length"
        class="rounded-2xl border border-slate-100 px-4 py-3 text-sm text-slate-500"
      >
        Aun no hay movimientos registrados.
      </div>
      <template v-else>
        <div
          v-for="movimiento in movimientos"
          :key="movimiento._id"
          class="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3"
        >
          <div>
            <p class="text-sm font-semibold">
              {{ movimiento.description }}
            </p>
            <p class="text-xs text-slate-400">
              {{ movimiento.category }} · {{ formatDate(movimiento.date) }}
            </p>
          </div>
          <p
            class="text-sm font-semibold"
            :class="movimiento.type === 'Ingreso' ? 'text-emerald-600' : 'text-amber-600'"
          >
            {{ movimiento.type === 'Ingreso' ? '+' : '-' }}
            {{ formatCurrency(movimiento.amount) }}
          </p>
        </div>
      </template>
    </div>
  </div>
</template>
