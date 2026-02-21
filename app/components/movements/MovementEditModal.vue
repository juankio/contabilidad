<script setup lang="ts">
defineProps<{
  open: boolean
  type: 'Gasto' | 'Ingreso' | null
  description: string
  category: string
  amountInput: string
  date: string
  loading: boolean
  error: string
  canSubmit: boolean
}>()

const emit = defineEmits<{
  (e: 'update:description' | 'update:category' | 'update:amountInput' | 'update:date', value: string): void
  (e: 'close' | 'confirm'): void
}>()
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"
    @click.self="emit('close')"
  >
    <div class="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
      <h3 class="text-lg font-semibold text-slate-900">
        Editar {{ type?.toLocaleLowerCase() || 'movimiento' }}
      </h3>

      <form
        class="mt-4 grid gap-3"
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
        <UInput
          :model-value="date"
          type="date"
          size="lg"
          @update:model-value="emit('update:date', String($event ?? ''))"
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
            @click="emit('close')"
          >
            Cancelar
          </UButton>
          <UButton
            color="neutral"
            type="submit"
            :loading="loading"
            :disabled="!canSubmit"
          >
            Guardar cambios
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>
