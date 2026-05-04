<script setup lang="ts">

const nombre = defineModel<string>('nombre', { required: true })
const cargo = defineModel<string>('cargo', { required: true })
const salario = defineModel<number>('salario', { required: true })

const salarioRef = computed({
  get: () => salario.value,
  set: (val) => salario.value = val
})

const { amountInput: salarioInput } = useMoneyInput(salarioRef)
</script>

<template>
  <FormField label="Nombre" for-id="nombre">
    <UInput
      id="nombre"
      v-model="nombre"
      placeholder="Ej. Juan Pérez"
      icon="lucide:user"
      size="lg"
      required
    />
  </FormField>

  <FormField label="Cargo" for-id="cargo">
    <UInput
      id="cargo"
      v-model="cargo"
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
</template>