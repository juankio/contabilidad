<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  open: boolean
  trabajador: any
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'confirm', id: string): void
}>()

const isModalOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

const handleConfirm = () => {
  if (!props.trabajador) return
  emit('confirm', props.trabajador._id)
}
</script>

<template>
  <ClientOnly fallback-tag="span">
    <UModal v-model:open="isModalOpen" :ui="{ content: 'sm:max-w-md sm:rounded-[2rem]', overlay: 'backdrop-blur-md bg-white/10 dark:bg-black/40' }" title="Eliminar Trabajador" description="Confirma la baja del sistema.">
      <template #content>
        <UCard :ui="{ root: 'ring-0 shadow-none divide-none', header: 'px-8 pt-8 pb-4', body: 'px-8 pb-8 pt-0' }" class="rounded-[2rem]">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 text-red-600">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                  <UIcon name="lucide:alert-triangle" class="h-5 w-5" />
                </div>
                <div>
                  <h3 class="text-lg font-bold tracking-tight text-slate-900">
                    Eliminar Trabajador
                  </h3>
                  <p class="text-sm text-slate-500">
                    Confirma la baja del sistema.
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

          <div class="py-2">
            <p class="text-slate-600">
              ¿Estás seguro que deseas eliminar a <strong class="text-slate-900 font-bold">{{ trabajador?.nombre }}</strong> de la plantilla?
            </p>
            <p class="mt-2 text-sm text-slate-500">
              Esta acción no se puede deshacer. Se mantendrá el historial de pagos realizados, pero el trabajador ya no aparecerá en la plantilla activa.
            </p>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <UButton
              color="neutral"
              variant="soft"
              size="lg"
              @click="isModalOpen = false"
            >
              Cancelar
            </UButton>
            <UButton
              color="error"
              size="lg"
              icon="lucide:trash-2"
              class="font-semibold shadow-sm"
              @click="handleConfirm"
            >
              Sí, eliminar
            </UButton>
          </div>
        </UCard>
      </template>
    </UModal>
  </ClientOnly>
</template>
