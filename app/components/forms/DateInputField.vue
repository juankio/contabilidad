<script setup lang="ts">
import FormField from './FormField.vue'

type DateModelValue = unknown

defineProps<{
  label: string
  forId: string
  modelValue: DateModelValue
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: DateModelValue): void
}>()

const inputDate = useTemplateRef('inputDate')
</script>

<template>
  <FormField
    :label="label"
    :for-id="forId"
  >
    <UInputDate
      ref="inputDate"
      class="w-full min-w-0"
      :model-value="modelValue as any"
      @update:model-value="emit('update:modelValue', $event as unknown)"
    >
      <template #trailing>
        <UPopover :reference="inputDate?.inputsRef[3]?.$el">
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="i-lucide-calendar"
            aria-label="Selecciona una fecha"
            class="px-0"
          />
          <template #content>
            <UCalendar
              :model-value="modelValue as any"
              class="p-2"
              @update:model-value="emit('update:modelValue', $event as unknown)"
            />
          </template>
        </UPopover>
      </template>
    </UInputDate>
  </FormField>
</template>
