<script setup lang="ts">
import { usePostres } from '../../composables/postres/usePostres'

const { postres, insumos, recetas, addRecetaItem, costUnit } = usePostres()
const postreId = ref('')
const insumoId = ref('')
const yields = ref('')
const error = ref('')

const postreItems = computed(() => postres.value.map(p => ({ label: p.name, value: p.id })))
const insumoItems = computed(() => insumos.value.map(i => ({ label: i.name, value: i.id })))
const recetaActual = computed(() => recetas.value[postreId.value] ?? [])
const costoActual = computed(() => postreId.value ? costUnit(postreId.value) : 0)

const submit = () => {
  error.value = ''
  const value = Number(yields.value)
  if (!addRecetaItem(postreId.value, insumoId.value, value)) {
    error.value = 'Selecciona postre, insumo y rendimiento.'
    return
  }
  yields.value = ''
}
</script>

<template>
  <section class="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow h-full">
    <!-- Header -->
    <div class="mb-5 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
          <UIcon name="lucide:book-open" class="h-5 w-5" />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Recetas
          </h2>
          <p class="text-sm text-slate-500">
            Calcula el costo por unidad.
          </p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <USelect
          v-model="postreId"
          :items="postreItems"
          placeholder="Postre"
          size="lg"
          icon="lucide:cake"
        />
        <USelect
          v-model="insumoId"
          :items="insumoItems"
          placeholder="Insumo"
          size="lg"
          icon="lucide:package"
        />
      </div>
      <UInput
        v-model="yields"
        placeholder="Rendimiento (Ej: Rinde 10 postres)"
        size="lg"
        inputmode="numeric"
        icon="lucide:pie-chart"
      />
      <UButton
        color="primary"
        icon="lucide:plus"
        size="lg"
        block
        @click="submit"
      >
        Añadir ingrediente a receta
      </UButton>
      <p
        v-if="error"
        class="text-sm font-medium text-rose-500"
      >
        {{ error }}
      </p>
    </div>

    <!-- Costo calculado -->
    <div
      v-if="postreId"
      class="mt-5 flex items-center justify-between rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3"
    >
      <span class="text-sm font-semibold uppercase tracking-widest text-violet-600">Costo de producción</span>
      <span class="text-xl font-bold tracking-tight text-violet-700">${{ costoActual.toLocaleString() }}</span>
    </div>

    <!-- Receta actual -->
    <div class="mt-5 flex-1">
      <div
        v-if="!recetaActual.length"
        class="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-6 text-center"
      >
        <UIcon name="lucide:file-question" class="mb-2 h-8 w-8 text-slate-300" />
        <p class="text-sm font-medium text-slate-600">
          {{ postreId ? 'Receta vacía' : 'Selecciona un postre' }}
        </p>
        <p class="text-xs text-slate-500">
          {{ postreId ? 'Agrega ingredientes arriba.' : 'Para ver sus ingredientes.' }}
        </p>
      </div>
      <ul
        v-else
        class="space-y-2"
      >
        <li
          v-for="item in recetaActual"
          :key="item.insumoId"
          class="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50"
        >
          <div class="flex items-center gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-100">
              <UIcon name="lucide:package" class="h-4 w-4 text-violet-500" />
            </div>
            <span class="text-base font-semibold text-slate-900">
              {{ insumos.find(i => i.id === item.insumoId)?.name }}
            </span>
          </div>
          <span class="rounded-xl bg-slate-100 px-3 py-1 text-sm font-bold tracking-tight text-slate-600 ring-1 ring-slate-200">
            Rinde {{ item.yields }}
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>
