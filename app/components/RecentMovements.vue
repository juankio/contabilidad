<script setup lang="ts">
type Movimiento = {
  _id: string
  type: 'Gasto' | 'Ingreso'
  description: string
  category: string
  amount: number
  date: string
}

const { data: movimientos, pending, error } = await useFetch<Movimiento[]>('/api/movimientos', {
  key: 'movimientos',
  query: { limit: 50 }
})

const { formatCurrency, formatShortDate } = useFormatters()
const showAllModal = ref(false)
const previewMovimientos = computed(() => (movimientos.value ?? []).slice(0, 3))
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm md:col-span-2 lg:col-span-2">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">
        Ultimos movimientos
      </h2>
      <button
        class="text-xs font-semibold text-emerald-600 disabled:cursor-not-allowed disabled:text-slate-400"
        :disabled="!movimientos?.length"
        @click="showAllModal = true"
      >
        Ver todos
      </button>
    </div>

    <div class="mt-4 grid gap-3">
      <div
        v-if="pending"
        class="rounded-2xl border border-slate-100 px-4 py-3 text-sm text-slate-500"
      >
        Cargando movimientos...
      </div>
      <div
        v-else-if="error"
        class="rounded-2xl border border-rose-100 px-4 py-3 text-sm text-rose-500"
      >
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
          v-for="movimiento in previewMovimientos"
          :key="movimiento._id"
          class="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3"
        >
          <div>
            <p class="text-sm font-semibold">
              {{ movimiento.description }}
            </p>
            <p class="text-xs text-slate-400">
              {{ movimiento.category }} · {{ formatShortDate(movimiento.date) }}
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

  <div
    v-if="showAllModal"
    class="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"
    @click.self="showAllModal = false"
  >
    <div class="w-full max-w-2xl rounded-3xl bg-white p-5 shadow-xl">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-900">
          Todos los movimientos
        </h3>
        <button
          class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
          @click="showAllModal = false"
        >
          Cerrar
        </button>
      </div>

      <div class="grid max-h-[65vh] gap-3 overflow-y-auto pr-1">
        <div
          v-for="movimiento in movimientos || []"
          :key="`modal-${movimiento._id}`"
          class="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3"
        >
          <div>
            <p class="text-sm font-semibold">
              {{ movimiento.description }}
            </p>
            <p class="text-xs text-slate-400">
              {{ movimiento.category }} · {{ formatShortDate(movimiento.date) }}
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
      </div>
    </div>
  </div>
</template>
