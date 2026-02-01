<script setup lang="ts">
type Gasto = {
  _id: string
  description: string
  category: string
  amount: number
  date: string
}

const { data: gastos, pending, error, refresh } = await useFetch<Gasto[]>('/api/gastos', {
  key: 'gastos'
})

const exporting = ref(false)

const exportGastos = async () => {
  exporting.value = true
  try {
    const response = await fetch('/api/gastos/export')
    if (!response.ok) {
      throw new Error('Export failed')
    }
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `gastos-${new Date().toISOString().slice(0, 10)}.xlsx`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  } catch {
    formError.value = 'No se pudo exportar a Excel.'
  } finally {
    exporting.value = false
  }
}

const handleGastoSaved = async () => {
  await refresh()
  await refreshNuxtData('estadisticas')
}

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
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-6xl px-4 pb-10 pt-6">
      <div class="grid gap-6 lg:grid-cols-12">
        <div class="rounded-3xl bg-white p-5 shadow-sm lg:col-span-12">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-semibold">
              Gastos
            </h1>
            <button
              type="button"
              class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 disabled:opacity-60"
              :disabled="exporting"
              @click="exportGastos"
            >
              {{ exporting ? 'Exportando...' : 'Exportar Excel' }}
            </button>
          </div>
          <p class="mt-2 text-sm text-slate-500">
            Lista simple de gastos recientes.
          </p>
        </div>

        <GastoForm @saved="handleGastoSaved" />

        <div class="grid gap-6 lg:col-span-8">
          <StatsCharts />

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
        </div>
      </div>
    </section>
  </main>
</template>
