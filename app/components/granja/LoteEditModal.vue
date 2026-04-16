<script setup lang="ts">
import { ref, watch } from 'vue'
import FormField from '../forms/FormField.vue'

const props = defineProps<{
  open: boolean
  lote: any
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'submit', id: string, data: { nombreLoteMadre: string }): void
}>()

const editFormData = ref({ nombreLoteMadre: '' })

watch(() => props.lote, (newVal) => {
  if (newVal) {
    editFormData.value.nombreLoteMadre = newVal.nombreLoteMadre
  }
}, { immediate: true })

const handleSubmit = () => {
  if (!props.lote || !editFormData.value.nombreLoteMadre) return
  emit('submit', props.lote._id, { nombreLoteMadre: editFormData.value.nombreLoteMadre })
}
</script>

<template>
  <ClientOnly fallback-tag="span">
    <UModal 
      :open="open" 
      @update:open="$emit('update:open', $event)" 
      :ui="{ content: 'sm:max-w-md sm:rounded-[2rem]', overlay: 'backdrop-blur-md bg-white/10 dark:bg-black/40' }" 
      title="Editar Lote" 
      description="Modifica la información del lote."
    >
      <template #content>
        <UCard :ui="{ root: 'ring-0 shadow-none divide-none', header: 'px-8 pt-8 pb-4', body: 'px-8 pb-8 pt-0' }" class="rounded-[2rem]">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                  <UIcon name="lucide:pencil" class="h-5 w-5" />
                </div>
                <div>
                  <h3 class="text-lg font-bold tracking-tight text-slate-900">
                    Editar Lote
                  </h3>
                  <p class="text-sm text-slate-500">
                    Modifica la información del lote.
                  </p>
                </div>
              </div>
              <UButton
                color="neutral"
                variant="ghost"
                icon="lucide:x"
                class="-my-1"
                @click="$emit('update:open', false)"
              />
            </div>
          </template>

          <form class="flex flex-col gap-6" @submit.prevent="handleSubmit">
            <FormField label="Nombre del Lote" for-id="edit-nombre-lote">
              <UInput
                id="edit-nombre-lote"
                v-model="editFormData.nombreLoteMadre"
                placeholder="Ej. Lote 1 - Cerdas Blancas"
                icon="lucide:tag"
                size="lg"
                required
              />
            </FormField>
            
            <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <UButton color="neutral" variant="soft" size="lg" @click="$emit('update:open', false)">
                Cancelar
              </UButton>
              <UButton type="submit" color="primary" size="lg" icon="lucide:save" class="font-semibold shadow-sm">
                Guardar Cambios
              </UButton>
            </div>
          </form>
        </UCard>
      </template>
    </UModal>
  </ClientOnly>
</template>
