<script setup lang="ts">
import { useGranjaCerdos } from '../composables/granja/useGranjaCerdos'
import LoteForm from '../components/granja/LoteForm.vue'
import ConcentradoForm from '../components/granja/ConcentradoForm.vue'

definePageMeta({ requiresModule: 'granja-cerdos' })

const { activeProfileName } = useProfile()
const profileInitial = computed(() => activeProfileName.value?.trim().charAt(0).toUpperCase() || 'M')

const { lotes, loading, fetchLotes, crearLote, comprarConcentrado } = useGranjaCerdos()

const handleCrearLote = async (payload: any) => {
  try {
    await crearLote(payload)
  } catch (err: any) {
    alert(err.message)
  }
}

const handleComprarConcentrado = async (payload: any) => {
  try {
    await comprarConcentrado(payload)
    alert('Compra de concentrado registrada. Se descontó del balance global.')
  } catch (err: any) {
    alert(err.message || 'Error al comprar concentrado')
  }
}

onMounted(() => fetchLotes())
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
                name="lucide:paw-print"
                class="h-3 w-3 text-white"
              />
            </span>
          </div>
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
              Módulo
            </p>
            <h1 class="text-lg font-semibold text-slate-900">
              Granja de Cerdos
            </h1>
          </div>
        </div>
        <p class="mt-3 text-sm text-slate-500">
          Controla animales, alimentación, peso y gastos directamente enlazados a tu caja.
        </p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <LoteForm @submit="handleCrearLote" />
        <ConcentradoForm @submit="handleComprarConcentrado" />
      </div>

      <div class="anim-up-3 mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 class="text-base font-medium text-slate-900 mb-4">
          Lotes Activos y Fichas
        </h2>
        <div
          v-if="loading"
          class="text-sm text-slate-500"
        >
          Cargando...
        </div>
        <div
          v-else-if="lotes.length === 0"
          class="text-sm text-slate-500"
        >
          No hay lotes registrados.
        </div>
        <div
          v-else
          class="space-y-4"
        >
          <div
            v-for="lote in lotes"
            :key="lote._id"
            class="p-4 rounded-xl bg-slate-50 border border-slate-100"
          >
            <div class="flex justify-between items-start mb-3">
              <div>
                <p class="font-bold text-slate-900">
                  {{ lote.nombreLoteMadre }}
                </p>
                <p class="text-sm text-slate-600">
                  Fecha Llegada/Parto: {{ new Date(lote.fechaLlegada).toLocaleDateString() }}
                </p>
              </div>
              <div class="bg-[var(--brand-100)] text-[var(--brand-700)] px-3 py-1 rounded-lg text-sm font-semibold">
                {{ lote.cantidadActual }} vivos de {{ lote.cantidadInicial }}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 text-sm mt-3 border-t border-slate-200 pt-3">
              <div>
                <p class="font-semibold text-slate-700 mb-1">
                  Horarios de Comida (Tabla)
                </p>
                <ul class="list-disc pl-4 text-slate-600">
                  <li
                    v-for="(h, i) in lote.horariosComida || []"
                    :key="i"
                  >
                    {{ h.hora }}: {{ h.cantidadKilos }}kg de {{ h.formula }}
                  </li>
                  <li
                    v-if="!(lote.horariosComida?.length)"
                    class="text-xs italic"
                  >
                    Sin horarios
                  </li>
                </ul>
              </div>
              <div>
                <p class="font-semibold text-slate-700 mb-1">
                  Registro de Muertes
                </p>
                <ul class="list-disc pl-4 text-slate-600">
                  <li
                    v-for="(m, i) in lote.muertes || []"
                    :key="i"
                  >
                    -{{ m.cantidad }} el {{ new Date(m.fecha).toLocaleDateString() }} ({{ m.causa }})
                  </li>
                  <li
                    v-if="!(lote.muertes?.length)"
                    class="text-xs italic"
                  >
                    Cero muertes registradas
                  </li>
                </ul>
              </div>
            </div>

            <div class="flex gap-2 mt-4">
              <UButton
                size="xs"
                color="neutral"
                variant="soft"
                icon="i-lucide-skull"
              >
                Muerte
              </UButton>
              <UButton
                size="xs"
                color="neutral"
                variant="soft"
                icon="i-lucide-clock"
              >
                Añadir Comida
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
