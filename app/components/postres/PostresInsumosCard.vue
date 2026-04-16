<script setup lang="ts">
import { usePostres } from '../../composables/postres/usePostres'

const { insumos, crear, eliminar } = usePostres()
const toast = useToast()

const name = ref('')
const unit = ref('g')
const cost = ref('')
const error = ref('')
const loading = ref(false)

const submit = async () => {
  error.value = ''
  const cleanName = name.value.trim()
  const value = Number(cost.value)

  if (!cleanName || value <= 0) {
    error.value = 'Completa nombre, unidad y costo válido.'
    return
  }

  loading.value = true
  try {
    await crear('insumos', { name: cleanName, unit: unit.value, cost: value })
    name.value = ''
    cost.value = ''
    toast.add({ title: 'Insumo agregado', color: 'success' })
  } catch (err: any) {
    error.value = err.message
    toast.add({ title: 'Error', description: err.message, color: 'error' })
  } finally {
    loading.value = false
  }
}

const deleteInsumo = async (id: string) => {
  if (!confirm('¿Eliminar insumo?')) return
  try {
    await eliminar('insumos', id)
    toast.add({ title: 'Insumo eliminado', color: 'success' })
  } catch (err: any) {
    toast.add({ title: 'Error al eliminar', description: err.message, color: 'error' })
  }
}

const units = [
  { label: 'g', value: 'g' },
  { label: 'kg', value: 'kg' },
  { label: 'ml', value: 'ml' },
  { label: 'L', value: 'L' }
]
</script>

<template>
  <section class="flex flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow h-full">
    <!-- Header -->
    <div class="mb-3 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
          <UIcon
            name="lucide:package"
            class="h-5 w-5"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Insumos
          </h2>
          <p class="text-sm text-slate-500">
            Ingredientes y su costo.
          </p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div class="space-y-2">
      <div class="grid grid-cols-2 gap-2">
        <UInput
          v-model="name"
          placeholder="Nombre insumo"
          icon="lucide:wheat"
        />
        <UInput
          v-model="cost"
          placeholder="0"
          inputmode="numeric"
          icon="lucide:circle-dollar-sign"
        />
      </div>
      <!-- Unit selector -->
      <div class="flex gap-2">
        <button
          v-for="item in units"
          :key="item.value"
          type="button"
          class="flex-1 rounded-xl px-2 py-1.5 text-sm font-semibold transition-all duration-200 active:scale-95"
          :class="unit === item.value
            ? 'bg-blue-600 text-white shadow-sm'
            : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
          @click="unit = item.value"
        >
          {{ item.label }}
        </button>
      </div>
      <UButton
        color="primary"
        icon="lucide:plus"
        block
        :loading="loading"
        @click="submit"
      >
        Agregar insumo
      </UButton>
      <p
        v-if="error"
        class="text-sm font-medium text-rose-500"
      >
        {{ error }}
      </p>
    </div>

    <!-- List -->
    <div class="mt-3 flex-1 min-h-0">
      <div
        v-if="!insumos.length"
        class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-6 text-center"
      >
        <UIcon
          name="lucide:inbox"
          class="mb-2 h-8 w-8 text-slate-300"
        />
        <p class="text-sm font-medium text-slate-600">
          Sin insumos
        </p>
        <p class="text-xs text-slate-500">
          Agrega el primer ingrediente.
        </p>
      </div>
      <ul
        v-else
        class="space-y-2 overflow-y-auto max-h-[30vh] md:max-h-[220px] pr-1 scrollbar-thin scrollbar-thumb-slate-200"
      >
        <li
          v-for="insumo in insumos"
          :key="insumo._id"
          class="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-2 transition-colors hover:bg-slate-50"
        >
          <div class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-100">
              <span class="text-sm font-bold text-blue-600">{{ insumo.name.charAt(0).toUpperCase() }}</span>
            </div>
            <span class="text-base font-semibold text-slate-900">{{ insumo.name }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="rounded-lg bg-slate-200/50 px-2 py-1 text-xs font-bold text-slate-600 uppercase tracking-widest">{{ insumo.unit }}</span>
            <span class="rounded-xl bg-blue-50 px-3 py-1 text-sm font-bold tracking-tight text-blue-700 ring-1 ring-blue-500/20">
              ${{ insumo.cost.toLocaleString() }}
            </span>
            <UButton
              color="error"
              variant="ghost"
              icon="lucide:trash-2"
              size="sm"
              class="opacity-0 group-hover:opacity-100 transition-opacity"
              @click="deleteInsumo(insumo._id)"
            />
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
