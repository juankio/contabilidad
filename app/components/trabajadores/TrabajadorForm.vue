<script setup lang="ts">
import { toRef } from 'vue'
import FormField from '../forms/FormField.vue'
import { useMoneyInput } from '../../composables/forms/useMoneyInput'

const emit = defineEmits<{ (e: 'submit', payload: any): void }>()

const form = reactive({
  nombre: '',
  cargo: '',
  salario: 0
})

const { amountInput: salarioInput } = useMoneyInput(toRef(form, 'salario'))

const onSubmit = () => {
  if (!form.nombre || form.salario <= 0) return
  emit('submit', { ...form })
  form.nombre = ''
  form.cargo = ''
  form.salario = 0
}
</script>

<template>
  <div class="anim-up-1 flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <div class="mb-5 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
          <UIcon name="lucide:user-plus" class="h-5 w-5" />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Añadir Trabajador
          </h2>
          <p class="text-sm text-slate-500">
            Registra nuevo personal.
          </p>
        </div>
      </div>
    </div>

    <form
      class="flex flex-1 flex-col gap-6 mt-2"
      @submit.prevent="onSubmit"
    >
      <FormField label="Nombre" for-id="nombre">
        <UInput
          id="nombre"
          v-model="form.nombre"
          placeholder="Ej. Juan Pérez"
          icon="lucide:user"
          size="lg"
          required
        />
      </FormField>

      <FormField label="Cargo" for-id="cargo">
        <UInput
          id="cargo"
          v-model="form.cargo"
          placeholder="Ej. Operario"
          icon="lucide:briefcase"
          size="lg"
          required
        />
      </FormField>

      <FormField label="Salario base" for-id="salario">
        <UInput
          id="salario"
          v-model="salarioInput"
          type="text"
          inputmode="numeric"
          placeholder="0"
          icon="lucide:circle-dollar-sign"
          size="lg"
          required
        />
      </FormField>

      <div class="mt-auto pt-2">
        <UButton
          type="submit"
          block
          color="primary"
          icon="lucide:plus"
          size="lg"
          class="font-semibold shadow-sm"
        >
          Crear trabajador
        </UButton>
      </div>
    </form>
  </div>
</template>
