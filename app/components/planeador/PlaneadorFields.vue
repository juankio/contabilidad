<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import DateInputField from '../forms/DateInputField.vue'
import FormField from '../forms/FormField.vue'

defineProps<{
  nombre: string
  descripcion: string
  amountInput: string
  fechaPlaneadaValue: CalendarDate | undefined
}>()

defineEmits<{
  'update:nombre': [value: string]
  'update:descripcion': [value: string]
  'update:amountInput': [value: string]
  'update:fechaPlaneadaValue': [value: CalendarDate | undefined]
}>()
</script>

<template>
  <div class="grid gap-4 w-full">
    <FormField
      label="¿Qué quieres comprar?"
      for-id="planeador-nombre"
      class="anim-up-1"
    >
      <UInput
        id="planeador-nombre"
        :model-value="nombre"
        @update:model-value="$emit('update:nombre', $event as string)"
        type="text"
        placeholder="Ej: Zapatos, celular, viaje..."
        maxlength="80"
        size="lg"
      />
    </FormField>

    <div class="anim-up-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField
        label="Cuánto cuesta"
        for-id="planeador-monto"
      >
        <UInput
          id="planeador-monto"
          :model-value="amountInput"
          @update:model-value="$emit('update:amountInput', $event as string)"
          type="text"
          inputmode="numeric"
          placeholder="0"
          size="lg"
        />
      </FormField>

      <DateInputField
        label="¿Para cuándo?"
        for-id="planeador-fecha"
        :model-value="fechaPlaneadaValue"
        @update:model-value="$emit('update:fechaPlaneadaValue', $event as CalendarDate | undefined)"
      />
    </div>

    <FormField
      label="Nota"
      for-id="planeador-descripcion"
      class="anim-up-3"
    >
      <UInput
        id="planeador-descripcion"
        :model-value="descripcion"
        @update:model-value="$emit('update:descripcion', $event as string)"
        type="text"
        placeholder="Por qué lo necesitas, dónde comprarlo..."
        maxlength="200"
        size="lg"
      />
    </FormField>
  </div>
</template>