<script setup lang="ts">
import type { OptionalModuleKey } from '../../../utils/modules'

defineProps<{
  selectedModules: OptionalModuleKey[]
  moduleOptions: { key: OptionalModuleKey, label: string, description: string }[]
}>()

const emit = defineEmits<{
  (e: 'toggleModule', module: OptionalModuleKey): void
}>()

function getModuleIcon(key: string) {
  const map: Record<string, string> = {
    'gastos': 'lucide:wallet',
    'postres': 'lucide:cake',
    'catalogo-postres': 'lucide:cake',
    'granja-cerdos': 'lucide:paw-print',
    'prestamos': 'lucide:handshake',
    'trabajadores': 'lucide:users',
    'planeador': 'lucide:shopping-bag'
  }
  return map[key] || 'lucide:puzzle'
}
</script>

<template>
  <div class="grid gap-2 text-sm anim-fade-1 mt-2">
    <p class="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-1">
      Módulos opcionales
    </p>
    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="module in props.moduleOptions"
        :key="module.key"
        type="button"
        class="group relative flex cursor-pointer flex-col items-start gap-2 rounded-2xl border-2 p-3 text-left transition-all duration-200 active:scale-[0.98]"
        :class="props.selectedModules.includes(module.key as OptionalModuleKey)
          ? 'border-slate-800 bg-slate-50 shadow-sm'
          : 'border-slate-200/80 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'"
        @click="emit('toggleModule', module.key as OptionalModuleKey)"
      >
        <div class="flex w-full items-center justify-between">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-[0.8rem] transition-colors"
            :class="props.selectedModules.includes(module.key as OptionalModuleKey)
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-400 ring-1 ring-slate-200'"
          >
            <UIcon
              :name="getModuleIcon(module.key)"
              class="h-4 w-4"
            />
          </div>
          <div
            class="flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all"
            :class="props.selectedModules.includes(module.key as OptionalModuleKey)
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : 'border-slate-300 bg-white'"
          >
            <UIcon
              v-if="props.selectedModules.includes(module.key as OptionalModuleKey)"
              name="lucide:check"
              class="h-3 w-3"
            />
          </div>
        </div>
        <span
          class="mt-1 block text-sm font-bold transition-colors"
          :class="props.selectedModules.includes(module.key as OptionalModuleKey) ? 'text-slate-900' : 'text-slate-700'"
        >
          {{ module.label }}
        </span>
      </button>
    </div>
  </div>
</template>
