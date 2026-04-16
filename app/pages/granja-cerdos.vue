<script setup lang="ts">
import { useGranjaCerdos } from '../composables/granja/useGranjaCerdos'
import LoteForm from '../components/granja/LoteForm.vue'
import ConcentradoForm from '../components/granja/ConcentradoForm.vue'

definePageMeta({ requiresModule: 'granja-cerdos' })

const { activeProfileName } = useProfile()
const profileInitial = computed(() => activeProfileName.value?.trim().charAt(0).toUpperCase() || 'M')

const { lotes, loading, fetchLotes, crearLote, comprarConcentrado } = useGranjaCerdos()

const toast = useToast()

const handleCrearLote = async (payload: any) => {
  try {
    await crearLote(payload)
    toast.add({
      title: 'Lote registrado',
      description: 'El nuevo lote ha sido añadido a la granja.',
      icon: 'lucide:check-circle',
      color: 'success'
    })
  } catch (err: any) {
    toast.add({
      title: 'Error al registrar lote',
      description: err.message || 'No se pudo crear el lote.',
      icon: 'lucide:alert-circle',
      color: 'error'
    })
  }
}

const handleComprarConcentrado = async (payload: any) => {
  try {
    await comprarConcentrado(payload)
    toast.add({
      title: 'Compra exitosa',
      description: 'El concentrado se ha registrado y se ha descontado de los fondos globales.',
      icon: 'lucide:check-circle',
      color: 'success'
    })
  } catch (err: any) {
    toast.add({
      title: 'Fondos insuficientes o error',
      description: err.message || 'No se pudo comprar el concentrado.',
      icon: 'lucide:alert-triangle',
      color: 'error'
    })
  }
}

onMounted(() => fetchLotes())
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-screen-2xl px-4 pb-10 pt-6">
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
            <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Módulo
            </p>
            <h1 class="text-2xl font-bold tracking-tight text-slate-900">
              Granja de Cerdos
            </h1>
            <p class="text-xs text-slate-500">
              Controla animales, alimentación, peso y gastos.
            </p>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <LoteForm @submit="handleCrearLote" />
        <ConcentradoForm @submit="handleComprarConcentrado" />
      </div>

      <div class="anim-up-3 mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
        <div class="mb-5 flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
              <UIcon name="lucide:list" class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-lg font-bold tracking-tight text-slate-900">
                Lotes Activos y Fichas
              </h2>
              <p class="text-sm text-slate-500">
                Lotes registrados en la granja.
              </p>
            </div>
          </div>
        </div>
        <div
          v-if="loading"
          class="flex items-center gap-2 text-sm text-slate-500 py-4"
        >
          <UIcon name="lucide:loader-2" class="h-4 w-4 animate-spin" />
          Cargando...
        </div>
        <div
          v-else-if="lotes.length === 0"
          class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-8 text-center"
        >
          <UIcon name="lucide:inbox" class="mb-2 h-8 w-8 text-slate-300" />
          <p class="text-sm font-medium text-slate-600">No hay lotes registrados</p>
          <p class="text-xs text-slate-500">Registra el primero para empezar a controlar.</p>
        </div>
        <div
          v-else
          class="grid gap-4 md:grid-cols-2"
        >
          <div
            v-for="lote in lotes"
            :key="lote._id"
            class="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <div class="flex justify-between items-start mb-3">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
                  <span class="text-sm font-bold text-primary">{{ lote.nombreLoteMadre.charAt(0).toUpperCase() }}</span>
                </div>
                <div>
                  <p class="font-bold text-slate-900 line-clamp-1">
                    {{ lote.nombreLoteMadre }}
                  </p>
                  <p class="text-xs text-slate-500">
                    Llegada/Parto: {{ new Date(lote.fechaLlegada).toLocaleDateString() }}
                  </p>
                </div>
              </div>
              <div class="bg-[var(--brand-100)] text-[var(--brand-700)] px-3 py-1 rounded-lg text-sm font-semibold whitespace-nowrap">
                {{ lote.cantidadActual }} vivos
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 text-sm mt-4 border-t border-slate-100 pt-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Horarios Comida
                </p>
                <ul class="space-y-1 text-slate-600">
                  <li
                    v-for="(h, i) in lote.horariosComida || []"
                    :key="i"
                    class="flex items-center gap-1.5 text-xs"
                  >
                    <UIcon name="lucide:clock" class="h-3 w-3 text-slate-400" />
                    <span>{{ h.hora }}: {{ h.cantidadKilos }}kg ({{ h.formula }})</span>
                  </li>
                  <li
                    v-if="!(lote.horariosComida?.length)"
                    class="text-xs italic text-slate-400"
                  >
                    Sin horarios
                  </li>
                </ul>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Bajas (Muertes)
                </p>
                <ul class="space-y-1 text-slate-600">
                  <li
                    v-for="(m, i) in lote.muertes || []"
                    :key="i"
                    class="flex items-center gap-1.5 text-xs text-rose-600"
                  >
                    <UIcon name="lucide:skull" class="h-3 w-3" />
                    <span>-{{ m.cantidad }} el {{ new Date(m.fecha).toLocaleDateString() }}</span>
                  </li>
                  <li
                    v-if="!(lote.muertes?.length)"
                    class="text-xs italic text-slate-400"
                  >
                    Cero muertes
                  </li>
                </ul>
              </div>
            </div>

            <div class="flex gap-2 mt-5">
              <UButton
                size="xs"
                color="error"
                variant="soft"
                icon="lucide:skull"
                class="flex-1 justify-center"
              >
                Muerte
              </UButton>
              <UButton
                size="xs"
                color="warning"
                variant="soft"
                icon="lucide:wheat"
                class="flex-1 justify-center"
              >
                Comida
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
