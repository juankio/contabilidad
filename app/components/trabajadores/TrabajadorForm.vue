<script setup lang="ts">
const emit = defineEmits<{ (e: 'submit', payload: any): void }>()

const form = reactive({
  nombre: '',
  cargo: '',
  salario: 0
})

const onSubmit = () => {
  if (!form.nombre || form.salario <= 0) return
  emit('submit', { ...form })
  form.nombre = ''
  form.cargo = ''
  form.salario = 0
}
</script>

<template>
  <div class="anim-up-1 rounded-2xl border border-slate-200 bg-white p-5">
    <h2 class="text-base font-medium text-slate-900 mb-4">
      Añadir Trabajador
    </h2>
    <form
      class="space-y-4"
      @submit.prevent="onSubmit"
    >
      <div>
        <label class="block text-sm text-slate-600">Nombre</label>
        <UInput
          v-model="form.nombre"
          required
        />
      </div>
      <div>
        <label class="block text-sm text-slate-600">Cargo</label>
        <UInput
          v-model="form.cargo"
          required
        />
      </div>
      <div>
        <label class="block text-sm text-slate-600">Salario base</label>
        <UInput
          v-model.number="form.salario"
          type="number"
          min="1"
          required
        />
      </div>
      <UButton
        type="submit"
        block
        color="neutral"
      >
        Crear trabajador
      </UButton>
    </form>
  </div>
</template>
