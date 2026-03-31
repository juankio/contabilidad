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
  <section class="rounded-3xl bg-white p-5 shadow-sm">
    <!-- Header -->
    <div class="mb-4 flex items-center gap-2.5">
      <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50">
        <UIcon
          name="lucide:book-open"
          class="h-4 w-4 text-violet-500"
        />
      </div>
      <div>
        <h2 class="text-sm font-semibold text-slate-900">
          Recetas
        </h2>
        <p class="text-xs text-slate-400">
          Rendimiento por insumo
        </p>
      </div>
    </div>

    <!-- Form -->
    <div class="space-y-2">
      <div class="grid grid-cols-2 gap-2">
        <USelect
          v-model="postreId"
          :items="postreItems"
          placeholder="Postre"
          size="sm"
        />
        <USelect
          v-model="insumoId"
          :items="insumoItems"
          placeholder="Insumo"
          size="sm"
        />
      </div>
      <UInput
        v-model="yields"
        placeholder="Postres por paquete"
        size="sm"
        inputmode="numeric"
      />
      <UButton
        color="primary"
        icon="i-lucide-plus"
        size="sm"
        block
        @click="submit"
      >
        Agregar a receta
      </UButton>
      <p
        v-if="error"
        class="text-xs text-rose-500"
      >
        {{ error }}
      </p>
    </div>

    <!-- Costo calculado -->
    <div
      v-if="postreId"
      class="mt-3 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
    >
      <span class="text-xs text-slate-500">Costo por postre</span>
      <span class="text-sm font-semibold text-slate-900">COP {{ costoActual.toLocaleString() }}</span>
    </div>

    <!-- Receta actual -->
    <div class="mt-4">
      <div
        v-if="!recetaActual.length"
        class="rounded-2xl border border-dashed border-slate-200 py-6 text-center"
      >
        <p class="text-xs text-slate-400">
          {{ postreId ? 'Sin ingredientes en esta receta' : 'Selecciona un postre para ver su receta' }}
        </p>
      </div>
      <ul
        v-else
        class="space-y-1.5"
      >
        <li
          v-for="item in recetaActual"
          :key="item.insumoId"
          class="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2"
        >
          <span class="text-sm font-medium text-slate-800">
            {{ insumos.find(i => i.id === item.insumoId)?.name }}
          </span>
          <span class="text-xs text-slate-500">Rinde {{ item.yields }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
