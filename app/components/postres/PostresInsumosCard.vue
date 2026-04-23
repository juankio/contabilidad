<script setup lang="ts">
import { usePostres } from '../../composables/postres/usePostres'

const { insumos, crear, eliminar, costUnit, loadingData } = usePostres()
const toast = useToast()
const { formatCurrency } = useFormatters()

const name = ref('')
const cost = ref('')
const unit = ref<'g' | 'ml' | 'un'>('g')
const yields = ref('')
const error = ref('')
const submitting = ref(false)

const submit = async () => {
  error.value = ''
  const cleanName = name.value.trim()
  const value = Number(cost.value)

  if (!cleanName || value <= 0) {
    error.value = 'Completa nombre, unidad y costo válido.'
    return
  }

  submitting.value = true
  try {
    await crear('insumos', { name: cleanName, unit: unit.value, cost: value })
    name.value = ''
    cost.value = ''
    toast.add({ title: 'Insumo agregado', color: 'success' })
  } catch (err: unknown) {
    const errorMsg = err as Error
    error.value = errorMsg.message
    toast.add({ title: 'Error', description: errorMsg.message, color: 'error' })
  } finally {
    submitting.value = false
  }
}

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

const units = [
  { label: 'g', value: 'g' },
  { label: 'kg', value: 'kg' },
  { label: 'ml', value: 'ml' },
  { label: 'L', value: 'L' }
]
</script>

<template>
  <section class="flex flex-col rounded-[2rem] border border-slate-200/60 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-all h-full">
    <!-- Header -->
    <div class="mb-6 flex items-start justify-between">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 ring-1 ring-slate-100">
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
            Materias primas.
          </p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Nombre del insumo</label>
          <UInput
            v-model="name"
            placeholder="Ej: Harina"
            size="lg"
            class="font-medium"
            icon="lucide:tag"
          />
        </div>
        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Precio de compra</label>
          <UInput
            v-model="cost"
            placeholder="0"
            inputmode="numeric"
            size="lg"
            class="font-medium"
            :ui="{ icon: { leading: { pointer: '' } } }"
          >
            <template #leading>
              <span class="text-slate-500">$</span>
            </template>
          </UInput>
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Unidad de medida y Cantidad</label>
        <div class="flex items-center gap-3">
          <div class="flex rounded-xl bg-slate-100 p-1">
            <button
              v-for="u in ['g', 'ml', 'un']"
              :key="u"
              type="button"
              class="rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all"
              :class="unit === u
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'"
              @click="unit = (u as 'g' | 'ml' | 'un')"
            >
              {{ u }}
            </button>
          </div>
          <UInput
            v-model="yields"
            placeholder="Rendimiento (ej. 1000)"
            inputmode="numeric"
            size="lg"
            class="flex-1 font-medium"
          />
        </div>
      </div>

      <div class="pt-2">
        <UButton
          color="primary"
          icon="lucide:check-circle"
          block
          size="lg"
          class="font-semibold shadow-sm"
          :loading="submitting"
          @click="submit"
        >
          Guardar insumo
        </UButton>
      </div>
      <p
        v-if="error"
        class="text-sm font-medium text-rose-500"
      >
        {{ error }}
      </p>
    </div>

    <!-- List -->
    <div class="mt-6 flex-1 min-h-0">
      <ul
        v-if="loadingData"
        class="space-y-3 overflow-y-auto max-h-[30vh] md:max-h-[220px] pr-1"
      >
        <li
          v-for="i in 3"
          :key="i"
          class="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3"
        >
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
      <div
        v-else-if="!insumos.length"
        class="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-8 text-center px-4"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
          <UIcon
            name="lucide:package"
            class="h-6 w-6"
          />
        </div>
        <p class="text-sm font-semibold text-slate-700">
          Sin insumos
        </p>
        <p class="mt-1 text-sm text-slate-500 max-w-[200px]">
          Registra tu primera materia prima.
        </p>
      </div>
      <ul
        v-else
        class="space-y-3 overflow-y-auto max-h-[30vh] md:max-h-[220px] pr-1 scrollbar-thin scrollbar-thumb-slate-200"
      >
        <li
          v-for="insumo in insumos"
          :key="insumo._id"
          class="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50"
        >
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100/80">
              <UIcon
                name="lucide:package"
                class="h-5 w-5 text-slate-500"
              />
            </div>
            <div>
              <p class="text-sm font-bold text-slate-900">
                {{ insumo.name }}
              </p>
              <p class="text-xs font-semibold text-slate-500">
                {{ formatCurrency(costUnit(insumo._id)) }} / {{ insumo.unit }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex flex-col items-end">
              <span class="rounded-xl bg-white px-3 py-1.5 text-sm font-bold tracking-tight text-slate-700 ring-1 ring-inset ring-slate-200/60 shadow-sm">
                {{ formatCurrency(insumo.cost) }}
              </span>
              <span class="text-[10px] font-bold text-slate-400 uppercase mt-1">por unid.</span>
            </div>
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
