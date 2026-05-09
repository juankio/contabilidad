<script setup lang="ts">
const { postres, crear } = usePostres()
const toast = useToast()

const postreId = ref('')
const qty = ref('')
const date = ref(new Date().toISOString().slice(0, 10))
const error = ref('')
const submitting = ref(false)

const postreItems = computed(() => postres.value.map(p => ({ label: p.name, value: p._id })))

const submit = async () => {
  error.value = ''
  const value = Number(qty.value)
  if (!postreId.value || value <= 0) {
    error.value = 'Selecciona postre y cantidad válida.'
    return
  }

  submitting.value = true
  try {
    await crear('ventas', { postreId: postreId.value, qty: value, date: date.value })
    qty.value = ''
    toast.add({ title: 'Venta registrada', color: 'success' })
  } catch (err: unknown) {
    const errObj = err as Error
    error.value = errObj.message
    toast.add({ title: 'Error', description: errObj.message, color: 'error' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Postre vendido</label>
        <USelect
          v-model="postreId"
          :items="postreItems"
          placeholder="Seleccionar postre"
          size="lg"
          class="font-medium"
          icon="lucide:cake"
        />
      </div>
      <div class="space-y-2">
        <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Cantidad</label>
        <UInput
          v-model="qty"
          placeholder="0"
          inputmode="numeric"
          size="lg"
          class="font-medium"
          icon="lucide:hash"
        />
      </div>
    </div>
    <div class="space-y-2">
      <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Fecha de venta</label>
      <UInput
        v-model="date"
        type="date"
        size="lg"
        class="font-medium"
        icon="lucide:calendar"
      />
    </div>
    <div class="pt-2">
      <UButton
        color="primary"
        icon="lucide:check-circle"
        block
        size="lg"
        class="font-semibold shadow-sm mt-1"
        :loading="submitting"
        @click="submit"
      >
        Registrar Venta (+COP)
      </UButton>
    </div>
    <p
      v-if="error"
      class="text-sm font-medium text-rose-500"
    >
      {{ error }}
    </p>
  </div>
</template>
