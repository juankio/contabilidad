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
  <div class="anim-up-1 flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <div class="mb-4 flex items-center gap-2">
      <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <UIcon name="lucide:user-plus" class="h-4 w-4" />
      </div>
      <h2 class="text-base font-semibold text-slate-900">
        Añadir Trabajador
      </h2>
    </div>

    <form
      class="flex flex-1 flex-col gap-4"
      @submit.prevent="onSubmit"
    >
      <div class="space-y-1">
        <label class="text-sm font-medium text-slate-700">Nombre</label>
        <UInput
          v-model="form.nombre"
          placeholder="Ej. Juan Pérez"
          icon="lucide:user"
          required
        />
      </div>

      <div class="space-y-1">
        <label class="text-sm font-medium text-slate-700">Cargo</label>
        <UInput
          v-model="form.cargo"
          placeholder="Ej. Operario"
          icon="lucide:briefcase"
          required
        />
      </div>

      <div class="space-y-1">
        <label class="text-sm font-medium text-slate-700">Salario base</label>
        <UInput
          v-model.number="form.salario"
          type="number"
          min="1"
          placeholder="0.00"
          icon="lucide:circle-dollar-sign"
          required
        />
      </div>

      <div class="mt-auto pt-2">
        <UButton
          type="submit"
          block
          color="primary"
          icon="lucide:plus"
        >
          Crear trabajador
        </UButton>
      </div>
    </form>
  </div>
</template>
