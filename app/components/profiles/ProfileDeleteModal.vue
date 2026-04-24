<script setup lang="ts">
defineProps<{
  open: boolean
  loading: boolean
  canDeleteProfiles: boolean
  profileName: string
  confirmInput: string
}>()

const emit = defineEmits<{
  (e: 'update:confirmInput', value: string): void
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
            Eliminar perfil
          </p>
          <UButton
            color="neutral"
            variant="ghost"
            icon="lucide:x"
            size="sm"
            @click="emit('update:open', false)"
          />
        </div>

        <template v-if="!canDeleteProfiles">
          <p class="text-sm text-slate-600">
            No puedes eliminar tu unico perfil activo. 
            Crea otro perfil primero si quieres eliminar este.
          </p>
          <div class="mt-4 flex justify-end">
            <UButton
              color="neutral"
              variant="ghost"
              @click="emit('update:open', false)"
            >
              Entendido
            </UButton>
          </div>
        </template>

        <template v-else>
          <p class="text-sm text-rose-600">
            Esta accion borrara todos los datos asociados a este perfil
            (gastos, prestamos, clientes). No se puede deshacer.
          </p>
          
          <form class="mt-4 grid gap-3" @submit.prevent="emit('confirm')">
            <p class="text-sm text-slate-700">
              Escribe <span class="font-bold">borrar {{ profileName }}</span> para confirmar:
            </p>
            <UInput
              :model-value="confirmInput"
              type="text"
              size="lg"
              placeholder="borrar..."
              @update:model-value="emit('update:confirmInput', String($event ?? ''))"
            />
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
                color="error"
                type="submit"
                :loading="loading"
                :disabled="confirmInput !== `borrar ${profileName}`"
              >
                Si, eliminar para siempre
              </UButton>
            </div>
          </form>
        </template>
      </div>
    </div>
  </Transition>
</template>
