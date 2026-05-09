<script setup lang="ts">
defineProps<{
  open: boolean
  loading: boolean
  error: string
  type: string | null
  description: string
  category: string
  amountInput: string
  date: any
}>()

const emit = defineEmits<{
  (e: 'update:description', value: string): void
  (e: 'update:category', value: string): void
  (e: 'update:amountInput', value: string): void
  (e: 'update:date', value: any): void
  (e: 'update:open', value: boolean): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <Transition name="modal">
    <div
      v-if="open"
      class="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-sm"
      @click.self="emit('update:open', false)"
    >
      <div class="anim-scale w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
        <div class="mb-4 flex items-center justify-between">
          <p class="text-base font-semibold text-slate-900">
            Editar {{ type?.toLocaleLowerCase() || 'movimiento' }}
          </p>
          <UButton
            color="neutral"
            variant="ghost"
            icon="lucide:x"
            size="sm"
            @click="emit('update:open', false)"
          />
        </div>

        <form
          class="grid gap-3"
          @submit.prevent="emit('confirm')"
        >
          <UInput
            :model-value="description"
            type="text"
            size="lg"
            placeholder="Descripcion"
            @update:model-value="emit('update:description', String($event ?? ''))"
          />
          <UInput
            :model-value="category"
            type="text"
            size="lg"
            maxlength="40"
            placeholder="Categoria"
            @update:model-value="emit('update:category', String($event ?? ''))"
          />
          <UInput
            :model-value="amountInput"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            size="lg"
            placeholder="Monto"
            @update:model-value="emit('update:amountInput', String($event ?? ''))"
          />
          <DateInputField
            v-if="date !== null"
            label=""
            for-id="movement-edit-date"
            :model-value="date"
            @update:model-value="emit('update:date', $event)"
          />

          <p
            v-if="error"
            class="text-sm text-rose-500"
          >
            {{ error }}
          </p>

          <div class="mt-2 flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              type="button"
              :disabled="loading"
              @click="emit('update:open', false)"
            >
              Cancelar
            </UButton>
            <UButton
              color="primary"
              type="submit"
              :loading="loading"
            >
              Guardar cambios
            </UButton>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>
