<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import FormField from '../forms/FormField.vue'
import { useMoneyInput } from '../../composables/forms/useMoneyInput'
import type { Trabajador, TrabajadorPayload } from '../../composables/trabajadores/useTrabajadores'

const props = defineProps<{
  open: boolean
  trabajador: Trabajador | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'submit', id: string, payload: Partial<TrabajadorPayload>): void
}>()

const isModalOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

const editForm = ref({ nombre: '', cargo: '', salario: 0 })

const editFormSalarioRef = computed({
  get: () => editForm.value.salario,
  set: (val) => editForm.value.salario = val
})
const { amountInput: editSalarioInput } = useMoneyInput(editFormSalarioRef)

watch(() => props.trabajador, (newTrabajador) => {
  if (newTrabajador) {
    editForm.value = {
      nombre: newTrabajador.nombre,
      cargo: newTrabajador.cargo,
      salario: newTrabajador.salario
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  if (!props.trabajador) return
  emit('submit', props.trabajador._id, editForm.value)
}
</script>

<template>
  <ClientOnly fallback-tag="span">
    <UModal v-model:open="isModalOpen" :ui="{ content: 'sm:max-w-md sm:rounded-[2rem]', overlay: 'backdrop-blur-md bg-white/10 dark:bg-black/40' }" title="Editar Trabajador" description="Modifica los datos del trabajador.">
      <template #content>
        <UCard :ui="{ root: 'ring-0 shadow-none divide-none', header: 'px-8 pt-8 pb-4', body: 'px-8 pb-8 pt-0' }" class="rounded-[2rem]">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                  <UIcon name="lucide:pencil" class="h-5 w-5" />
                </div>
                <div>
                  <h3 class="text-lg font-bold tracking-tight text-slate-900">
                    Editar Trabajador
                  </h3>
                  <p class="text-sm text-slate-500">
                    Modifica los datos del trabajador.
                  </p>
                </div>
              </div>
              <UButton
                color="neutral"
                variant="ghost"
                icon="lucide:x"
                class="-my-1"
                @click="isModalOpen = false"
              />
            </div>
          </template>

          <form
            class="flex flex-col gap-6"
            @submit.prevent="handleSubmit"
          >
            <FormField label="Nombre" for-id="edit-nombre">
              <UInput
                id="edit-nombre"
                v-model="editForm.nombre"
                placeholder="Nombre completo"
                icon="lucide:user"
                size="lg"
                required
              />
            </FormField>
            
            <FormField label="Cargo" for-id="edit-cargo">
              <UInput
                id="edit-cargo"
                v-model="editForm.cargo"
                placeholder="Puesto que desempeña"
                icon="lucide:briefcase"
                size="lg"
                required
              />
            </FormField>
            
            <FormField label="Salario Base" for-id="edit-salario">
              <UInput
                id="edit-salario"
                v-model="editSalarioInput"
                type="text"
                inputmode="numeric"
                icon="lucide:circle-dollar-sign"
                size="lg"
                required
                placeholder="0"
              />
            </FormField>

            <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <UButton
                color="neutral"
                variant="soft"
                size="lg"
                @click="isModalOpen = false"
              >
                Cancelar
              </UButton>
              <UButton
                type="submit"
                color="primary"
                size="lg"
                icon="lucide:save"
                class="font-semibold shadow-sm"
              >
                Guardar Cambios
              </UButton>
            </div>
          </form>
        </UCard>
      </template>
    </UModal>
  </ClientOnly>
</template>
