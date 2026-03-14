<script setup lang="ts">
import { PROFILE_ICONS } from '../../utils/profile-icons'

defineProps<{
  open: boolean
  loading: boolean
  name: string
  icon: string
}>()

const emit = defineEmits<{
  (e: 'update:name' | 'update:icon', value: string): void
  (e: 'close' | 'confirm'): void
}>()

const iconPickerOpen = ref(false)
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"
    @click.self="emit('close')"
  >
    <div class="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
      <h3 class="text-lg font-semibold text-slate-900">
        Cambiar nombre del perfil
      </h3>
      <p class="mt-1 text-sm text-slate-700">
        Confirma el nuevo nombre del perfil activo.
      </p>

      <div class="mt-4">
        <UInput
          :model-value="name"
          type="text"
          size="lg"
          maxlength="32"
          placeholder="Nuevo nombre del perfil"
          aria-label="Nuevo nombre del perfil"
          autofocus
          @update:model-value="emit('update:name', String($event ?? ''))"
        />
      </div>

      <div class="mt-4">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          Icono del perfil
        </p>
        <div class="mt-2">
          <UPopover
            v-model:open="iconPickerOpen"
            :disabled="loading"
            :content="{ side: 'bottom', align: 'start', sideOffset: 8 }"
          >
            <UButton
              color="neutral"
              variant="outline"
              size="sm"
              class="h-9 w-12 justify-center"
              type="button"
              :disabled="loading"
              aria-label="Seleccionar icono del perfil"
            >
              <UIcon
                :name="icon || 'i-lucide-user'"
                class="h-5 w-5"
              />
            </UButton>

            <template #content>
              <div class="w-72 p-3">
                <div class="grid max-h-56 grid-cols-6 gap-2 overflow-y-auto pr-1">
                  <button
                    v-for="option in PROFILE_ICONS"
                    :key="option.icon"
                    type="button"
                    class="flex items-center justify-center rounded-lg border p-2 transition"
                    :class="icon === option.icon
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'"
                    @click="
                      emit('update:icon', option.icon);
                      iconPickerOpen = false
                    "
                  >
                    <UIcon
                      :name="option.icon"
                      class="h-4 w-4"
                    />
                  </button>
                </div>
              </div>
            </template>
          </UPopover>
        </div>
      </div>

      <div class="mt-5 flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          type="button"
          :disabled="loading"
          aria-label="Cancelar"
          @click="emit('close')"
        >
          Cancelar
        </UButton>
        <UButton
          color="neutral"
          type="button"
          :disabled="name.trim().length < 2 || name.trim().length > 32"
          aria-label="Usar este nombre"
          @click="emit('confirm')"
        >
          Usar este nombre
        </UButton>
      </div>
    </div>
  </div>
</template>
