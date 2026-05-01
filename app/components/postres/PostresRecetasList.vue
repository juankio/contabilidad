<script setup lang="ts">
import { usePostres } from '../../composables/postres/usePostres'

const {
  editar,
  activePostre,
  getInsumoName,
  getInsumoUnit,
  getInsumoCost
} = usePostres()
const toast = useToast()
const { formatCurrency } = useFormatters()

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
  <div class="mt-6 flex-1 min-h-0">
    <div v-if="!activePostre" class="flex h-full min-h-[150px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-8 text-center px-4">
      <UIcon name="lucide:mouse-pointer-click" class="mb-3 h-10 w-10 text-slate-300" />
      <p class="text-sm font-semibold text-slate-600">Selecciona un postre arriba</p>
    </div>
    <ul v-else-if="!activePostre.receta || !activePostre.receta.length" class="flex h-full min-h-[150px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-8 text-center px-4">
      <p class="text-sm font-semibold text-slate-600">Sin insumos</p>
      <p class="text-xs font-medium text-slate-500 mt-1">Agrega insumos a la receta.</p>
    </ul>
    <ul v-else class="space-y-3 overflow-y-auto max-h-[30vh] md:max-h-[220px] pr-1 scrollbar-thin scrollbar-thumb-slate-200">
      <li v-for="(item, idx) in activePostre.receta" :key="idx" class="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100/80">
            <UIcon name="lucide:flask-conical" class="h-5 w-5 text-slate-500" />
          </div>
          <div>
            <p class="text-sm font-bold text-slate-900">{{ getInsumoName(item.insumoId) }}</p>
            <p class="text-xs font-semibold text-slate-500">Usa: {{ item.yields }} {{ getInsumoUnit(item.insumoId) }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="rounded-xl bg-white px-3 py-1.5 text-sm font-bold tracking-tight text-slate-700 ring-1 ring-inset ring-slate-200/60 shadow-sm">
            {{ formatCurrency(getInsumoCost(item.insumoId, item.yields)) }}
          </span>
          <UButton color="error" variant="ghost" icon="lucide:trash-2" size="sm" class="opacity-0 group-hover:opacity-100 transition-opacity" @click="removeInsumo(item.insumoId)" />
        </div>
      </li>
    </ul>
  </div>
</template>