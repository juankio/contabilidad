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
  <section class="rounded-3xl bg-white p-5 shadow-sm">
    <!-- Header -->
    <div class="mb-4 flex items-center gap-2.5">
      <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50">
        <UIcon
          name="lucide:package"
          class="h-4 w-4 text-emerald-500"
        />
      </div>
      <div>
        <h2 class="text-sm font-semibold text-slate-900">
          Insumos
        </h2>
        <p class="text-xs text-slate-400">
          Costo del paquete y medida
        </p>
      </div>
    </div>

    <!-- Form -->
    <div class="space-y-2">
      <div class="grid grid-cols-2 gap-2">
        <UInput
          v-model="name"
          placeholder="Insumo"
          size="sm"
        />
        <UInput
          v-model="cost"
          placeholder="Costo del paquete"
          size="sm"
          inputmode="numeric"
        />
      </div>
      <!-- Unit selector -->
      <div class="flex gap-1.5">
        <button
          v-for="item in units"
          :key="item.value"
          type="button"
          class="rounded-lg px-3 py-1 text-xs font-semibold transition-all duration-150 active:scale-95"
          :class="unit === item.value
            ? 'text-white shadow-sm'
            : 'border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'"
          :style="unit === item.value ? { background: 'var(--brand-600)' } : {}"
          @click="unit = item.value"
        >
          {{ item.label }}
        </button>
      </div>
      <UButton
        color="primary"
        icon="i-lucide-plus"
        size="sm"
        block
        @click="submit"
      >
        Agregar insumo
      </UButton>
      <p
        v-if="error"
        class="text-xs text-rose-500"
      >
        {{ error }}
      </p>
    </div>

    <!-- List -->
    <div class="mt-4">
      <div
        v-if="!insumos.length"
        class="rounded-2xl border border-dashed border-slate-200 py-6 text-center"
      >
        <p class="text-xs text-slate-400">
          Sin insumos registrados
        </p>
      </div>
      <ul
        v-else
        class="space-y-1.5"
      >
        <li
          v-for="insumo in insumos"
          :key="insumo.id"
          class="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2"
        >
          <span class="text-sm font-medium text-slate-800">{{ insumo.name }}</span>
          <div class="flex items-center gap-2">
            <span class="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-500">{{ insumo.unit }}</span>
            <span class="text-sm font-semibold text-slate-700">COP {{ insumo.cost.toLocaleString() }}</span>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
