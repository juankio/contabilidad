<script setup lang="ts">

const { crear } = usePostres()
const toast = useToast()

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
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Nombre del insumo</label>
        <UInput v-model="name" placeholder="Ej: Harina" size="lg" class="font-medium" icon="lucide:tag" />
      </div>
      <div class="space-y-2">
        <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Precio de compra</label>
        <UInput v-model="cost" placeholder="0" inputmode="numeric" size="lg" class="font-medium" :ui="{ icon: { leading: { pointer: '' } } }">
          <template #leading><span class="text-slate-500">$</span></template>
        </UInput>
      </div>
    </div>

    <div class="space-y-2">
      <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Unidad de medida y Cantidad</label>
      <div class="flex items-center gap-3">
        <div class="flex rounded-xl bg-slate-100 p-1">
          <button v-for="u in ['g', 'ml', 'un']" :key="u" type="button" class="rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all" :class="unit === u ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'" @click="unit = (u as 'g' | 'ml' | 'un')">
            {{ u }}
          </button>
        </div>
        <UInput v-model="yields" placeholder="Rendimiento (ej. 1000)" inputmode="numeric" size="lg" class="flex-1 font-medium" />
      </div>
    </div>

    <div class="pt-2">
      <UButton color="primary" icon="lucide:check-circle" block size="lg" class="font-semibold shadow-sm" :loading="submitting" @click="submit">
        Guardar insumo
      </UButton>
    </div>
    <p v-if="error" class="text-sm font-medium text-rose-500">{{ error }}</p>
  </div>
</template>