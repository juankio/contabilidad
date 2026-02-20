<script setup lang="ts">
type Gasto = {
  _id: string
  description: string
  category: string
  amount: number
  date: string
}

const props = defineProps<{
  gastos: Gasto[] | null | undefined
  pending: boolean
  error: boolean
  formatCurrency: (value: number) => string
  formatDate: (value: string) => string
}>()

const showAllModal = ref(false)
const previewGastos = computed(() => (props.gastos ?? []).slice(0, 3))
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm">
    <div class="mb-3 flex items-center justify-between gap-3">
      <div>
        <p class="text-sm font-semibold text-slate-800">
          Gastos recientes
        </p>
        <p class="text-xs text-slate-500">
          Perfil activo
        </p>
      </div>
      <button
        class="text-xs font-semibold text-emerald-600 disabled:cursor-not-allowed disabled:text-slate-400"
        :disabled="!props.gastos?.length"
        @click="showAllModal = true"
      >
        Ver mas
      </button>
    </div>

    <div class="grid gap-3">
      <div
        v-if="props.pending"
        class="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500 md:col-span-2"
      >
        Cargando gastos...
      </div>
      <div
        v-else-if="props.error"
        class="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-500 md:col-span-2"
      >
        No se pudieron cargar los gastos. Revisa la conexion al backend.
      </div>
      <div
        v-else-if="!props.gastos?.length"
        class="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500 md:col-span-2"
      >
        Aun no hay gastos registrados.
      </div>
      <template v-else>
        <div
          v-for="gasto in previewGastos"
          :key="gasto._id"
          class="rounded-2xl border border-slate-100 px-4 py-3"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-slate-800">
                {{ gasto.description }}
              </p>
              <p class="mt-1 text-xs text-slate-500">
                {{ gasto.category }} · {{ props.formatDate(gasto.date) }}
              </p>
              <span class="mt-2 inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-700">
                Gasto
              </span>
            </div>
            <p class="shrink-0 whitespace-nowrap text-sm font-semibold text-amber-600">
              -{{ props.formatCurrency(gasto.amount) }}
            </p>
          </div>
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
          Todos los gastos del perfil activo
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
          v-for="gasto in props.gastos || []"
          :key="`modal-${gasto._id}`"
          class="rounded-2xl border border-slate-100 px-4 py-3"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-slate-800">
                {{ gasto.description }}
              </p>
              <p class="mt-1 text-xs text-slate-500">
                {{ gasto.category }} · {{ props.formatDate(gasto.date) }}
              </p>
            </div>
            <p class="shrink-0 whitespace-nowrap text-sm font-semibold text-amber-600">
              -{{ props.formatCurrency(gasto.amount) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
