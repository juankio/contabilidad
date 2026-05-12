<script setup lang="ts">
const { crear } = usePostres()
const toast = useToast()

const name = ref('')
const price = ref('')
const error = ref('')
const submitting = ref(false)

const submit = async () => {
  error.value = ''
  const cleanName = name.value.trim()
  const value = Number(price.value)

  if (!cleanName || value <= 0) {
    error.value = 'Completa nombre y precio válido.'
    return
  }

  submitting.value = true
  try {
    await crear('postres', { name: cleanName, price: value })
    name.value = ''
    price.value = ''
    toast.add({ title: 'Postre agregado', color: 'success' })
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
        <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Nombre</label>
        <UInput
          v-model="name"
          placeholder="Ej: Torta 3 leches"
          size="lg"
          class="font-medium"
          icon="lucide:tag"
        />
      </div>
      <div class="space-y-2">
        <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Precio Venta</label>
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
        Guardar producto
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
