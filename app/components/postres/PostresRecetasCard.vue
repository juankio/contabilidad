<script setup lang="ts">
import { usePostres } from '../../composables/postres/usePostres'

const {
  postres,
  insumos,
  crear,
  editar,
  eliminar,
  costUnit,
  loadingData,
  activePostre,
  activePostreCost,
  activePostreProfit,
  addRecetaItem,
  getInsumoName,
  getInsumoUnit,
  getInsumoCost
} = usePostres()
const toast = useToast()
const { formatCurrency } = useFormatters()

const postreId = ref('')
const insumoId = ref('')
const yields = ref('')
const error = ref('')
const submitting = ref(false)

const addInsumo = async () => {
  error.value = ''
  if (!postreId.value || !insumoId.value || Number(yields.value) <= 0) {
    error.value = 'Completa postre, insumo y cantidad'
    return
  }
  submitting.value = true
  try {
    await addRecetaItem(postreId.value, insumoId.value, Number(yields.value))
    insumoId.value = ''
    yields.value = ''
    toast.add({ title: 'Insumo añadido', color: 'success' })
  } catch (err) {
    const e = err as Error
    error.value = e.message
    toast.add({ title: 'Error', description: e.message, color: 'error' })
  } finally {
    submitting.value = false
  }
}

const removeInsumo = async (id: string) => {
  if (!activePostre.value || !confirm('¿Eliminar insumo de la receta?')) return
  try {
    const recetaSinEl = activePostre.value.receta?.filter(r => r.insumoId !== id) || []
    await editar('postres', activePostre.value._id, { receta: recetaSinEl })
    toast.add({ title: 'Insumo removido', color: 'success' })
  } catch (err) {
    const e = err as Error
    toast.add({ title: 'Error', description: e.message, color: 'error' })
  }
}
</script>

<template>
  <section class="flex flex-col rounded-[2rem] border border-slate-200/60 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-all h-full">
    <!-- Header -->
    <div class="mb-6 flex items-start justify-between">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 ring-1 ring-slate-100">
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
            Asocia insumos a postres.
          </p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Seleccionar Postre</label>
          <USelect
            v-model="postreId"
            :options="postres.map(p => ({ label: p.name, value: p._id }))"
            size="lg"
            class="font-medium"
            icon="lucide:cake"
          />
        </div>
        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Seleccionar Insumo</label>
          <USelect
            v-model="insumoId"
            :options="insumos.map(i => ({ label: i.name, value: i._id }))"
            size="lg"
            class="font-medium"
            icon="lucide:package"
          />
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Cantidad requerida</label>
        <div class="flex gap-2">
          <UInput
            v-model="yields"
            placeholder="0"
            inputmode="numeric"
            size="lg"
            class="flex-1 font-medium"
            icon="lucide:scale"
          />
          <UButton
            color="primary"
            icon="lucide:plus"
            block
            size="lg"
            class="font-semibold shadow-sm"
            :loading="submitting"
            @click="addInsumo"
          >
            Añadir
          </UButton>
        </div>
      </div>

      <p
        v-if="error"
        class="text-sm font-medium text-rose-500"
      >
        {{ error }}
      </p>
    </div>

    <!-- Active Postre Cost Summary -->
    <div
      v-if="activePostre"
      class="mt-6 flex items-center justify-between rounded-2xl border border-slate-200/60 bg-slate-50 px-4 py-3"
    >
      <div>
        <p class="text-xs font-bold uppercase tracking-wider text-slate-500">
          Costo Total Producción
        </p>
        <p class="text-lg font-extrabold text-slate-900">
          {{ formatCurrency(activePostreCost) }}
        </p>
      </div>
      <div class="text-right">
        <p class="text-xs font-bold uppercase tracking-wider text-slate-500">
          Margen / Ganancia
        </p>
        <p
          class="text-sm font-extrabold"
          :class="activePostreProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'"
        >
          {{ formatCurrency(activePostreProfit) }}
        </p>
      </div>
    </div>

    <!-- List of Insumos for Active Postre -->
    <div class="mt-6 flex-1 min-h-0">
      <div
        v-if="!activePostre"
        class="flex h-full min-h-[150px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-8 text-center px-4"
      >
        <UIcon
          name="lucide:mouse-pointer-click"
          class="mb-3 h-10 w-10 text-slate-300"
        />
        <p class="text-sm font-semibold text-slate-600">
          Selecciona un postre arriba
        </p>
      </div>
      <ul
        v-else-if="!activePostre.receta || !activePostre.receta.length"
        class="flex h-full min-h-[150px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-8 text-center px-4"
      >
        <p class="text-sm font-semibold text-slate-600">
          Sin insumos
        </p>
        <p class="text-xs font-medium text-slate-500 mt-1">
          Agrega insumos a la receta.
        </p>
      </ul>
      <ul
        v-else
        class="space-y-3 overflow-y-auto max-h-[30vh] md:max-h-[220px] pr-1 scrollbar-thin scrollbar-thumb-slate-200"
      >
        <li
          v-for="(item, idx) in activePostre.receta"
          :key="idx"
          class="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50"
        >
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100/80">
              <UIcon
                name="lucide:flask-conical"
                class="h-5 w-5 text-slate-500"
              />
            </div>
            <div>
              <p class="text-sm font-bold text-slate-900">
                {{ getInsumoName(item.insumoId) }}
              </p>
              <p class="text-xs font-semibold text-slate-500">
                Usa: {{ item.yields }} {{ getInsumoUnit(item.insumoId) }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="rounded-xl bg-white px-3 py-1.5 text-sm font-bold tracking-tight text-slate-700 ring-1 ring-inset ring-slate-200/60 shadow-sm">
              {{ formatCurrency(getInsumoCost(item.insumoId, item.yields)) }}
            </span>
            <UButton
              color="error"
              variant="ghost"
              icon="lucide:trash-2"
              size="sm"
              class="opacity-0 group-hover:opacity-100 transition-opacity"
              @click="removeInsumo(item.insumoId)"
            />
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
