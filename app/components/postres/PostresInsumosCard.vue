<script setup lang="ts">
import { usePostres } from '../../composables/postres/usePostres'

const { insumos, addInsumo } = usePostres()
const name = ref('')
const unit = ref('g')
const cost = ref('')
const error = ref('')

const submit = () => {
  error.value = ''
  const value = Number(cost.value)
  if (!addInsumo(name.value, unit.value, value)) {
    error.value = 'Completa nombre, unidad y costo.'
    return
  }
  name.value = ''
  cost.value = ''
}

const units = [
  { label: 'g', value: 'g' },
  { label: 'kg', value: 'kg' },
  { label: 'ml', value: 'ml' },
  { label: 'L', value: 'L' }
]
</script>

<template>
  <section class="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <!-- Header -->
    <div class="mb-5 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
          <UIcon name="lucide:package" class="h-5 w-5" />
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
    <div class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <UInput
          v-model="name"
          placeholder="Nombre insumo"
          size="lg"
          icon="lucide:wheat"
        />
        <UInput
          v-model="cost"
          placeholder="0"
          size="lg"
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
          class="flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 active:scale-95"
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
        size="lg"
        block
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
    <div class="mt-5 flex-1">
      <div
        v-if="!insumos.length"
        class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-8 text-center"
      >
        <UIcon name="lucide:inbox" class="mb-2 h-8 w-8 text-slate-300" />
        <p class="text-sm font-medium text-slate-600">Sin insumos</p>
        <p class="text-xs text-slate-500">Agrega el primer ingrediente.</p>
      </div>
      <ul
        v-else
        class="space-y-2"
      >
        <li
          v-for="insumo in insumos"
          :key="insumo.id"
          class="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50"
        >
          <div class="flex items-center gap-3">
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
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
