<script setup lang="ts">
import IconSelector from '../ui/IconSelector.vue'

defineProps<{
  open: boolean
  loading: boolean
  name: string
  icon: string
}>()

const emit = defineEmits<{
  (e: 'update:name', value: string): void
  (e: 'update:icon', value: string): void
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
            Personalizar
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
          class="grid gap-4"
          @submit.prevent="emit('confirm')"
        >
          <div class="grid gap-1.5 text-sm">
            <label for="renameProfileName" class="font-semibold text-slate-700">Nombre de tu espacio</label>
            <UInput
              id="renameProfileName"
              :model-value="name"
              type="text"
              required
              maxlength="32"
              size="lg"
              placeholder="Ej. Tienda Centro"
              @update:model-value="emit('update:name', String($event ?? ''))"
            />
          </div>

          <div class="grid gap-1.5 text-sm">
            <label class="font-semibold text-slate-700">Icono representativo</label>
            <IconSelector
              :model-value="icon"
              @update:model-value="emit('update:icon', $event)"
            />
          </div>

          <div class="mt-4 flex justify-end gap-2">
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
              icon="lucide:check"
            >
              Guardar cambios
            </UButton>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>
