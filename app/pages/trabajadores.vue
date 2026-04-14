<script setup lang="ts">
import { useTrabajadores } from '../composables/trabajadores/useTrabajadores'
import TrabajadorForm from '../components/trabajadores/TrabajadorForm.vue'
import PagoForm from '../components/trabajadores/PagoForm.vue'

definePageMeta({ requiresModule: 'trabajadores' })

const { activeProfileName } = useProfile()
const profileInitial = computed(() => activeProfileName.value?.trim().charAt(0).toUpperCase() || 'M')

const { trabajadores, loading, fetchTrabajadores, crearTrabajador, pagarTrabajador } = useTrabajadores()

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
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <TrabajadorForm @submit="handleCrear" />
        <PagoForm
          :trabajadores="trabajadores"
          @submit="handlePagar"
        />
      </div>

      <div class="anim-up-3 mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 class="text-base font-medium text-slate-900 mb-4">
          Plantilla Actual
        </h2>
        <div
          v-if="loading"
          class="text-sm text-slate-500"
        >
          Cargando...
        </div>
        <div
          v-else-if="trabajadores.length === 0"
          class="text-sm text-slate-500"
        >
          No hay trabajadores registrados.
        </div>
        <div
          v-else
          class="space-y-3"
        >
          <div
            v-for="t in trabajadores"
            :key="t._id"
            class="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100"
          >
            <div>
              <p class="font-medium text-slate-900">
                {{ t.nombre }}
              </p>
              <p class="text-xs text-slate-500">
                {{ t.cargo }}
              </p>
            </div>
            <p class="text-sm font-semibold text-slate-900">
              ${{ t.salario.toLocaleString() }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
