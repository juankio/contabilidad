<script setup lang="ts">

defineProps<{
  abonoSaving: boolean
  abonoError: any
  abonoSuccess: any
}>()

const abonoAmountInput = defineModel<string | number>('abonoAmountInput', { required: true })
const abonoDateValue = defineModel<unknown>('abonoDateValue', { required: true })
const abonoNote = defineModel<string>('abonoNote', { required: true })
const emit = defineEmits<{ (e: 'submit'): void }>()
</script>

<template>
  <div class="mt-4 rounded-xl border border-slate-200 bg-transparent p-3">
    <form
      class="grid gap-3"
      @submit.prevent="emit('submit')"
    >
      <FormField
        label="Monto del abono"
        for-id="abono-amount"
      >
        <UInput
          id="abono-amount"
          v-model="abonoAmountInput"
          type="text"
          inputmode="numeric"
          placeholder="0"
          size="md"
        />
      </FormField>
      <DateInputField
        label="Fecha del abono"
        for-id="abono-date"
        :model-value="abonoDateValue"
        @update:model-value="abonoDateValue = $event as unknown"
      />
      <FormField
        label="Nota"
        for-id="abono-note"
      >
        <UInput
          id="abono-note"
          v-model="abonoNote"
          type="text"
          maxlength="160"
          placeholder="Opcional"
          size="md"
        />
      </FormField>
      <p
        v-if="abonoError"
        class="text-sm text-rose-500"
      >
        {{ abonoError }}
      </p>
      <p
        v-if="abonoSuccess"
        class="text-sm text-emerald-600"
      >
        {{ abonoSuccess }}
      </p>
      <UButton
        type="submit"
        color="primary"
        size="sm"
        :loading="abonoSaving"
      >
        {{ abonoSaving ? 'Guardando...' : 'Recibir Abono (+COP)' }}
      </UButton>
    </form>
  </div>
</template>
