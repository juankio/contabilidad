<script setup lang="ts">
import type { Prestamo } from '../../composables/prestamos/types'
import FormField from '../forms/FormField.vue'
import DateInputField from '../forms/DateInputField.vue'

const props = defineProps<{
  target: Prestamo | null
  isEditing: boolean
  editError: string | null
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submit'): void
}>()

const form = defineModel<{
  borrower: string
  description: string
  amountInput: string
  dateValue: Date | null
  collectionDateValue: Date | null
  note: string
}>('form', { required: true })

const isOpen = computed({
  get: () => props.target !== null,
  set: (val) => {
    if (!val) emit('cancel')
  }
})
</script>

<template>
  <UModal v-model="isOpen">
    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold tracking-tight text-slate-900">
              Editar préstamo
            </h3>
            <ClientOnly>
              <UButton
                color="neutral"
                variant="ghost"
                icon="lucide:x"
                class="-my-1"
                @click="emit('cancel')"
              />
            </ClientOnly>
          </div>
        </template>

        <form
          v-if="target"
          class="grid gap-4"
          @submit.prevent="emit('submit')"
        >
          <UAlert
            v-if="editError"
            color="error"
            variant="soft"
            icon="lucide:alert-circle"
            :title="editError"
          />

          <FormField
            label="Persona"
            for-id="edit-borrower"
          >
            <UInput
              id="edit-borrower"
              v-model="form.borrower"
              type="text"
              maxlength="60"
              size="lg"
            />
          </FormField>

          <FormField
            label="Monto prestado"
            for-id="edit-amount"
          >
            <UInput
              id="edit-amount"
              v-model="form.amountInput"
              type="text"
              inputmode="numeric"
              size="lg"
            />
          </FormField>

          <FormField
            label="Descripción"
            for-id="edit-description"
          >
            <UInput
              id="edit-description"
              v-model="form.description"
              type="text"
              maxlength="120"
              size="lg"
            />
          </FormField>

          <DateInputField
            label="Fecha del prestamo"
            for-id="edit-loan-date"
            :model-value="form.dateValue"
            @update:model-value="form.dateValue = $event as any"
          />

          <DateInputField
            label="Fecha esperada de cobro (Opcional)"
            for-id="edit-collection-date"
            :model-value="form.collectionDateValue"
            @update:model-value="form.collectionDateValue = $event as any"
          />
          <div
            v-if="form.collectionDateValue"
            class="flex justify-end -mt-2"
          >
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              label="Quitar fecha de cobro"
              @click="form.collectionDateValue = null"
            />
          </div>

          <FormField
            label="Notas"
            for-id="edit-note"
          >
            <UInput
              id="edit-note"
              v-model="form.note"
              type="text"
              maxlength="160"
              size="lg"
            />
          </FormField>

          <div class="mt-4 flex justify-end gap-3">
            <UButton
              color="neutral"
              variant="ghost"
              label="Cancelar"
              @click="emit('cancel')"
            />
            <UButton
              type="submit"
              color="primary"
              label="Guardar cambios"
              :loading="isEditing"
            />
          </div>
        </form>
      </UCard>
    </template>
  </UModal>
</template>
