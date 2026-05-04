<script setup lang="ts">

const {
  postres,
  insumos,
  addRecetaItem
} = usePostres()
const toast = useToast()

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
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Seleccionar Postre</label>
        <USelect v-model="postreId" :options="postres.map(p => ({ label: p.name, value: p._id }))" size="lg" class="font-medium" icon="lucide:cake" />
      </div>
      <div class="space-y-2">
        <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Seleccionar Insumo</label>
        <USelect v-model="insumoId" :options="insumos.map(i => ({ label: i.name, value: i._id }))" size="lg" class="font-medium" icon="lucide:package" />
      </div>
    </div>

    <div class="space-y-2">
      <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Cantidad requerida</label>
      <div class="flex gap-2">
        <UInput v-model="yields" placeholder="0" inputmode="numeric" size="lg" class="flex-1 font-medium" icon="lucide:scale" />
        <UButton color="primary" icon="lucide:plus" block size="lg" class="font-semibold shadow-sm" :loading="submitting" @click="addInsumo">
          Añadir
        </UButton>
      </div>
    </div>

    <p v-if="error" class="text-sm font-medium text-rose-500">{{ error }}</p>
  </div>
</template>