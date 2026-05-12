<script setup lang="ts">
import { ref } from 'vue'

const {
  insumos,
  crear
} = usePostres()
const toast = useToast()

const name = ref('')
const price = ref('')
const selectedInsumoId = ref('')
const yields = ref('')

const localReceta = ref<{ insumoId: string, yields: number }[]>([])
const submitting = ref(false)
const error = ref('')

const addLocalInsumo = () => {
  if (!selectedInsumoId.value || Number(yields.value) <= 0) {
    toast.add({ title: 'Completa insumo y cantidad', color: 'error' })
    return
  }

  const existing = localReceta.value.find(r => r.insumoId === selectedInsumoId.value)
  if (existing) {
    existing.yields += Number(yields.value)
  } else {
    localReceta.value.push({
      insumoId: selectedInsumoId.value,
      yields: Number(yields.value)
    })
  }

  selectedInsumoId.value = ''
  yields.value = ''
}

const removeLocalInsumo = (idx: number) => {
  localReceta.value.splice(idx, 1)
}

const getInsumoName = (id: string) => insumos.value.find(i => i._id === id)?.name || ''
const getInsumoUnit = (id: string) => insumos.value.find(i => i._id === id)?.unit || ''

const emit = defineEmits<{
  (e: 'created'): void
}>()

const submit = async () => {
  error.value = ''
  const cleanName = name.value.trim()
  const value = Number(price.value)

  if (!cleanName || value <= 0) {
    error.value = 'Completa el nombre y precio válido.'
    return
  }

  submitting.value = true
  try {
    await crear('postres', {
      name: cleanName,
      price: value,
      receta: localReceta.value
    })

    name.value = ''
    price.value = ''
    localReceta.value = []

    toast.add({ title: 'Receta creada exitosamente', color: 'success' })
    emit('created')
  } catch (err: unknown) {
    const errorMsg = err as Error
    error.value = errorMsg.message
    toast.add({ title: 'Error', description: errorMsg.message, color: 'error' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Paso 1: Datos Base -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Nombre del Postre</label>
        <UInput
          v-model="name"
          placeholder="Ej: Torta 3 leches"
          size="lg"
          class="font-medium"
          icon="lucide:cake"
        />
      </div>
      <div class="space-y-2">
        <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Precio de Venta</label>
        <UInput
          v-model="price"
          placeholder="0"
          inputmode="numeric"
          size="lg"
          class="font-medium"
          :ui="{ leading: 'pointer-events-auto' }"
        >
          <template #leading>
            <span class="text-slate-500">$</span>
          </template>
        </UInput>
      </div>
    </div>

    <!-- Paso 2: Insumos -->
    <div class="space-y-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div class="flex items-center justify-between">
        <label class="text-xs font-semibold uppercase tracking-wider text-slate-700">Ingredientes de la Receta</label>
        <UBadge
          color="neutral"
          variant="subtle"
        >
          {{ localReceta.length }} insumos
        </UBadge>
      </div>

      <div class="flex flex-col sm:flex-row gap-2">
        <USelect
          v-model="selectedInsumoId"
          :options="insumos.map(i => ({ label: i.name, value: i._id }))"
          size="lg"
          class="font-medium flex-1"
          icon="lucide:package"
          placeholder="Seleccionar Insumo"
        />
        <div class="flex gap-2 sm:w-1/2">
          <UInput
            v-model="yields"
            placeholder="Cant."
            inputmode="numeric"
            size="lg"
            class="w-full font-medium"
            icon="lucide:scale"
          />
          <UButton
            color="neutral"
            variant="outline"
            icon="lucide:plus"
            size="lg"
            @click="addLocalInsumo"
          />
        </div>
      </div>

      <!-- Lista Temporal de Insumos -->
      <ul
        v-if="localReceta.length > 0"
        class="space-y-2 mt-4 max-h-40 overflow-y-auto pr-1 scrollbar-thin"
      >
        <li
          v-for="(item, idx) in localReceta"
          :key="idx"
          class="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-100 shadow-sm"
        >
          <div class="flex items-center gap-2">
            <UIcon
              name="lucide:flask-conical"
              class="h-4 w-4 text-slate-400"
            />
            <span class="text-sm font-semibold text-slate-700">{{ getInsumoName(item.insumoId) }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs font-medium text-slate-500">{{ item.yields }} {{ getInsumoUnit(item.insumoId) }}</span>
            <UButton
              color="error"
              variant="ghost"
              icon="lucide:x"
              size="xs"
              @click="removeLocalInsumo(idx)"
            />
          </div>
        </li>
      </ul>
    </div>

    <div class="pt-4 flex flex-col gap-2">
      <UButton
        color="primary"
        icon="lucide:check-circle"
        block
        size="lg"
        class="font-bold shadow-md"
        :loading="submitting"
        @click="submit"
      >
        Guardar Receta Completa
      </UButton>
      <p
        v-if="error"
        class="text-sm font-medium text-rose-500 text-center"
      >
        {{ error }}
      </p>
    </div>
  </div>
</template>
