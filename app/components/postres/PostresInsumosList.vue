<script setup lang="ts">
import { usePostres } from '../../composables/postres/usePostres'

const { insumos, eliminar, costUnit, loadingData } = usePostres()
const toast = useToast()
const { formatCurrency } = useFormatters()

const deleteInsumo = async (id: string) => {
  if (!confirm('¿Eliminar insumo?')) return
  try {
    await eliminar('insumos', id)
    toast.add({ title: 'Insumo eliminado', color: 'success' })
  } catch (err: unknown) {
    const errorMsg = err as Error
    toast.add({ title: 'Error al eliminar', description: errorMsg.message, color: 'error' })
  }
}
</script>

<template>
  <div class="mt-6 flex-1 min-h-0">
    <ul v-if="loadingData" class="space-y-3 overflow-y-auto max-h-[30vh] md:max-h-[220px] pr-1">
      <li v-for="i in 3" :key="i" class="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3">
        <div class="flex items-center gap-3">
          <USkeleton class="h-10 w-10 rounded-xl" />
          <div class="space-y-2">
            <USkeleton class="h-4 w-24 rounded-md" />
            <USkeleton class="h-3 w-12 rounded-md" />
          </div>
        </div>
        <USkeleton class="h-8 w-20 rounded-xl" />
      </li>
    </ul>
    <div v-else-if="!insumos.length" class="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-8 text-center px-4">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
        <UIcon name="lucide:package" class="h-6 w-6" />
      </div>
      <p class="text-sm font-semibold text-slate-700">Sin insumos</p>
      <p class="mt-1 text-sm text-slate-500 max-w-[200px]">Registra tu primera materia prima.</p>
    </div>
    <ul v-else class="space-y-3 overflow-y-auto max-h-[30vh] md:max-h-[220px] pr-1 scrollbar-thin scrollbar-thumb-slate-200">
      <li v-for="insumo in insumos" :key="insumo._id" class="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100/80">
            <UIcon name="lucide:package" class="h-5 w-5 text-slate-500" />
          </div>
          <div>
            <p class="text-sm font-bold text-slate-900">{{ insumo.name }}</p>
            <p class="text-xs font-semibold text-slate-500">{{ formatCurrency(costUnit(insumo._id)) }} / {{ insumo.unit }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex flex-col items-end">
            <span class="rounded-xl bg-white px-3 py-1.5 text-sm font-bold tracking-tight text-slate-700 ring-1 ring-inset ring-slate-200/60 shadow-sm">
              {{ formatCurrency(insumo.cost) }}
            </span>
            <span class="text-[10px] font-bold text-slate-400 uppercase mt-1">por unid.</span>
          </div>
          <UButton color="error" variant="ghost" icon="lucide:trash-2" size="sm" class="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity" @click="deleteInsumo(insumo._id)" />
        </div>
      </li>
    </ul>
  </div>
</template>