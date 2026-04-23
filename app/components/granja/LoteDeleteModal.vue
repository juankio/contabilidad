<script setup lang="ts">
import type { Lote } from '../../composables/granja/useGranjaCerdos'

defineProps<{
  open: boolean
  lote: Lote | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'confirm', id: string): void
}>()
</script>

<template>
  <ClientOnly fallback-tag="span">
    <UModal
      :open="open"
      :ui="{ content: 'sm:max-w-md sm:rounded-[2rem]', overlay: 'backdrop-blur-md bg-white/10 dark:bg-black/40' }"
      title="Eliminar Lote"
      description="Confirma la eliminación del lote."
      @update:open="$emit('update:open', $event)"
    >
      <template #content>
        <UCard
          :ui="{ root: 'ring-0 shadow-none divide-none', header: 'px-8 pt-8 pb-4', body: 'px-8 pb-8 pt-0' }"
          class="rounded-[2rem]"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 text-red-600">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                  <UIcon
                    name="lucide:alert-triangle"
                    class="h-5 w-5"
                  />
                </div>
                <div>
                  <h3 class="text-lg font-bold tracking-tight text-slate-900">
                    Eliminar Lote
                  </h3>
                  <p class="text-sm text-slate-500">
                    Confirma la eliminación del lote.
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

          <div class="py-2">
            <p class="text-slate-600">
              ¿Estás seguro que deseas eliminar el lote <strong class="text-slate-900 font-bold">{{ lote?.nombreLoteMadre }}</strong>?
            </p>
            <p class="mt-2 text-sm text-slate-500">
              Esta acción eliminará de forma permanente todos los registros de alimentación y bajas asociados a este lote. Esta acción no se puede deshacer.
            </p>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <UButton
              color="neutral"
              variant="soft"
              size="lg"
              @click="$emit('update:open', false)"
            >
              Cancelar
            </UButton>
            <UButton
              color="error"
              size="lg"
              icon="lucide:trash-2"
              class="font-semibold shadow-sm"
              @click="$emit('confirm', lote?._id || '')"
            >
              Sí, eliminar
            </UButton>
          </div>
        </UCard>
      </template>
    </UModal>
  </ClientOnly>
</template>
