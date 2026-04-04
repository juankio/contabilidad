<script setup lang="ts">
import { useProfileColorPicker } from '../../composables/useProfileColorPicker'
import ProfileEditPreview from './ProfileEditPreview.vue'
import ProfileIconPicker from './ProfileIconPicker.vue'
import ProfileColorPicker from './ProfileColorPicker.vue'

const props = defineProps<{
  open: boolean
  loading: boolean
  name: string
  icon: string
}>()

const emit = defineEmits<{
  (e: 'update:name' | 'update:icon', value: string): void
  (e: 'close' | 'confirm'): void
}>()

const colorPicker = useProfileColorPicker()
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 p-4 backdrop-blur-sm"
    @click.self="emit('close')"
  >
    <div class="w-full max-w-md rounded-3xl bg-white shadow-2xl">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h3 class="text-base font-semibold text-slate-900">
            Editar perfil
          </h3>
          <p class="text-xs text-slate-500">
            Nombre, ícono y color
          </p>
        </div>
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          @click="emit('close')"
        >
          <UIcon
            name="lucide:x"
            class="h-4 w-4"
          />
        </button>
      </div>

      <div class="space-y-5 px-6 py-5">
        <ProfileEditPreview
          :name="props.name"
          :icon="props.icon"
          :swatch="colorPicker.activeSwatch.value"
        />

        <div>
          <p class="mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Nombre
          </p>
          <UInput
            :model-value="props.name"
            type="text"
            size="lg"
            maxlength="32"
            placeholder="Nombre del perfil"
            aria-label="Nombre del perfil"
            autofocus
            @update:model-value="emit('update:name', String($event ?? ''))"
          />
        </div>

        <div>
          <p class="mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Ícono
          </p>
          <ProfileIconPicker
            :icon="props.icon"
            :disabled="props.loading"
            @update:icon="emit('update:icon', $event)"
          />
        </div>

        <div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Color
          </p>
          <ProfileColorPicker
            :active-color="colorPicker.activeColor.value"
            :saving="colorPicker.saving.value"
            @select="colorPicker.selectColor"
          />
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
        <UButton
          color="neutral"
          variant="ghost"
          type="button"
          icon="lucide:x"
          :disabled="props.loading"
          @click="emit('close')"
        >
          Cancelar
        </UButton>
        <UButton
          color="primary"
          type="button"
          icon="lucide:check"
          :disabled="props.name.trim().length < 2 || props.name.trim().length > 32"
          :loading="props.loading"
          @click="emit('confirm')"
        >
          Guardar cambios
        </UButton>
      </div>
    </div>
  </div>
</template>
