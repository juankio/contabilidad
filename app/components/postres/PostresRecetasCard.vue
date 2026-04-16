<script setup lang="ts">
import { usePostres } from '../../composables/postres/usePostres'

const { postres, insumos, recetas, addRecetaItem, costUnit, editar } = usePostres()
const toast = useToast()

const postreId = ref('')
const insumoId = ref('')
const yields = ref('')
const error = ref('')
const loading = ref(false)

const postreItems = computed(() => postres.value.map(p => ({ label: p.name, value: p._id })))
const insumoItems = computed(() => insumos.value.map(i => ({ label: i.name, value: i._id })))
const recetaActual = computed(() => recetas.value[postreId.value] ?? [])
const costoActual = computed(() => postreId.value ? costUnit(postreId.value) : 0)

const submit = async () => {
  error.value = ''
  const value = Number(yields.value)
  if (!postreId.value || !insumoId.value || value <= 0) {
    error.value = 'Selecciona postre, insumo y rendimiento.'
    return
  }

  loading.value = true
  try {
    await addRecetaItem(postreId.value, insumoId.value, value)
    yields.value = ''
    insumoId.value = ''
    toast.add({ title: 'Ingrediente añadido a receta', color: 'success' })
  } catch (err: any) {
    error.value = err.message
    toast.add({ title: 'Error', description: err.message, color: 'error' })
  } finally {
    loading.value = false
  }
}

const deleteItem = async (insumoIdToRemove: string) => {
  if (!confirm('¿Quitar ingrediente de la receta?')) return
  const current = recetas.value[postreId.value] ?? []
  const updated = current.filter(item => item.insumoId !== insumoIdToRemove)
  try {
    await editar('postres', postreId.value, { recipe: updated })
    toast.add({ title: 'Ingrediente eliminado', color: 'success' })
  } catch (err: any) {
    toast.add({ title: 'Error al quitar ingrediente', description: err.message, color: 'error' })
  }
}
</script>

<template>
  <section class="flex flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow h-full">
    <!-- Header -->
    <div class="mb-3 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
          <UIcon
            name="lucide:book-open"
            class="h-5 w-5"
          />
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
    <div class="space-y-2">
      <div class="grid grid-cols-2 gap-2">
        <USelect
          v-model="postreId"
          :items="postreItems"
          placeholder="Postre"
          icon="lucide:cake"
        />
        <USelect
          v-model="insumoId"
          :items="insumoItems"
          placeholder="Insumo"
          icon="lucide:package"
        />
      </div>
      <UInput
        v-model="yields"
        placeholder="Rendimiento (Ej: Rinde 10 postres)"
        inputmode="numeric"
        icon="lucide:pie-chart"
      />
      <UButton
        color="primary"
        icon="lucide:plus"
        block
        :loading="loading"
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
      class="mt-3 flex items-center justify-between rounded-2xl border border-violet-100 bg-violet-50 px-3 py-2"
    >
      <span class="text-sm font-semibold uppercase tracking-widest text-violet-600">Costo de producción</span>
      <span class="text-xl font-bold tracking-tight text-violet-700">${{ costoActual.toLocaleString() }}</span>
    </div>

    <!-- Receta actual -->
    <div class="mt-3 flex-1 min-h-0">
      <div
        v-if="!recetaActual.length"
        class="flex h-full min-h-[150px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-4 text-center"
      >
        <UIcon
          name="lucide:file-question"
          class="mb-2 h-8 w-8 text-slate-300"
        />
        <p class="text-sm font-medium text-slate-600">
          {{ postreId ? 'Receta vacía' : 'Selecciona un postre' }}
        </p>
        <p class="text-xs text-slate-500">
          {{ postreId ? 'Agrega ingredientes arriba.' : 'Para ver sus ingredientes.' }}
        </p>
      </div>
      <ul
        v-else
        class="space-y-2 overflow-y-auto max-h-[30vh] md:max-h-[220px] pr-1 scrollbar-thin scrollbar-thumb-slate-200"
      >
        <li
          v-for="item in recetaActual"
          :key="item.insumoId"
          class="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-2 transition-colors hover:bg-slate-50"
        >
          <div class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-100">
              <UIcon
                name="lucide:package"
                class="h-4 w-4 text-violet-500"
              />
            </div>
            <span class="text-base font-semibold text-slate-900">
              {{ insumos.find(i => i._id === item.insumoId)?.name }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="rounded-xl bg-slate-100 px-3 py-1 text-sm font-bold tracking-tight text-slate-600 ring-1 ring-slate-200">
              Rinde {{ item.yields }}
            </span>
            <UButton
              color="error"
              variant="ghost"
              icon="lucide:trash-2"
              size="sm"
              class="opacity-0 group-hover:opacity-100 transition-opacity"
              @click="deleteItem(item.insumoId)"
            />
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
