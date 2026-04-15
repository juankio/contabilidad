<script setup lang="ts">
import { useTrabajadores } from '../composables/trabajadores/useTrabajadores'
import TrabajadorForm from '../components/trabajadores/TrabajadorForm.vue'
import PagoForm from '../components/trabajadores/PagoForm.vue'
import { useResumen } from '../composables/useResumen'

definePageMeta({ requiresModule: 'trabajadores' })

const { activeProfileName } = useProfile()
const profileInitial = computed(() => activeProfileName.value?.trim().charAt(0).toUpperCase() || 'M')

const { trabajadores, loading, fetchTrabajadores, crearTrabajador, pagarTrabajador } = useTrabajadores()
const { resumen, formatCurrency } = await useResumen()

const saldoDisponible = computed(() => resumen.value?.saldoDisponible ?? resumen.value?.saldo ?? 0)

const handleCrear = async (payload: any) => {
  try {
    await crearTrabajador(payload)
  } catch (err: any) {
    alert(err.message || 'Error al crear trabajador')
  }
}

const handlePagar = async (payload: any) => {
  try {
    await pagarTrabajador(payload)
    alert('Pago registrado correctamente. Se ha descontado de tus fondos.')
  } catch (err: any) {
    alert(err.message || 'Error al pagar')
  }
}

onMounted(() => fetchTrabajadores())
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-5xl px-4 pb-10 pt-6">
      <header class="anim-up rounded-3xl bg-white p-5 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div
              class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm"
              style="background: var(--brand-600)"
            >
              <span class="text-sm font-bold text-white">{{ profileInitial }}</span>
              <span class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-700">
                <UIcon
                  name="lucide:users"
                  class="h-3 w-3 text-white"
                />
              </span>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
                Módulo
              </p>
              <h1 class="text-lg font-semibold text-slate-900">
                Trabajadores y Nómina
              </h1>
            </div>
          </div>
          
          <div class="flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-2 border border-emerald-100">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <UIcon name="lucide:wallet" class="h-4 w-4" />
            </div>
            <div>
              <p class="text-xs text-emerald-600 font-medium">Disponible para pagos</p>
              <p class="text-lg font-bold text-emerald-700">{{ formatCurrency(saldoDisponible) }}</p>
            </div>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <TrabajadorForm @submit="handleCrear" />
        <PagoForm
          :trabajadores="trabajadores"
          @submit="handlePagar"
        />
      </div>

      <div class="anim-up-3 mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="mb-4 flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <UIcon name="lucide:users" class="h-4 w-4" />
          </div>
          <h2 class="text-base font-semibold text-slate-900">
            Plantilla Actual
          </h2>
        </div>

        <div
          v-if="loading"
          class="flex items-center gap-2 text-sm text-slate-500 py-4"
        >
          <UIcon name="lucide:loader-2" class="h-4 w-4 animate-spin" />
          Cargando...
        </div>
        <div
          v-else-if="trabajadores.length === 0"
          class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-8 text-center"
        >
          <UIcon name="lucide:inbox" class="mb-2 h-8 w-8 text-slate-300" />
          <p class="text-sm font-medium text-slate-600">No hay trabajadores</p>
          <p class="text-xs text-slate-500">Agrega el primero para empezar.</p>
        </div>
        <div
          v-else
          class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div
            v-for="t in trabajadores"
            :key="t._id"
            class="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
                  <span class="text-sm font-bold text-primary">{{ t.nombre.charAt(0).toUpperCase() }}</span>
                </div>
                <div>
                  <p class="font-medium text-slate-900 line-clamp-1">
                    {{ t.nombre }}
                  </p>
                  <p class="text-xs text-slate-500">
                    {{ t.cargo }}
                  </p>
                </div>
              </div>
            </div>
            
            <div class="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
              <span class="text-xs text-slate-500">Salario base</span>
              <p class="text-sm font-semibold text-slate-900">
                ${{ t.salario.toLocaleString() }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
