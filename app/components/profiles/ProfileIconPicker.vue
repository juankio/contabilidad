<script setup lang="ts">
import { PROFILE_ICONS } from '../../utils/profile-icons'

const props = defineProps<{ icon: string, disabled?: boolean }>()
const emit = defineEmits<{ (e: 'update:icon', value: string): void }>()

const open = ref(false)
</script>

<template>
  <UPopover
    v-model:open="open"
    :disabled="props.disabled"
    :content="{ side: 'bottom', align: 'start', sideOffset: 8 }"
  >
    <button
      type="button"
      class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300"
      :disabled="props.disabled"
      aria-label="Seleccionar ícono"
    >
      <UIcon
        :name="props.icon || 'i-lucide-user'"
        class="h-5 w-5 text-slate-700"
      />
    </button>

    <template #content>
      <div class="w-72 p-3">
        <div class="grid max-h-56 grid-cols-6 gap-2 overflow-y-auto pr-1">
          <button
            v-for="option in PROFILE_ICONS"
            :key="option.icon"
            type="button"
            class="flex items-center justify-center rounded-lg border p-2 transition"
            :class="props.icon === option.icon ? 'text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'"
            :style="props.icon === option.icon ? { background: 'var(--brand-600)', borderColor: 'var(--brand-600)' } : {}"
            @click="emit('update:icon', option.icon); open = false"
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
</template>
