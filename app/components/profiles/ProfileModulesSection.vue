<script setup lang="ts">
import { OPTIONAL_MODULES, type OptionalModuleKey } from '../../utils/modules'

defineProps<{
  selectedModules: string[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'update:selectedModules', value: string[]): void
}>()

const setModule = (key: OptionalModuleKey, value: boolean, current: string[]) => {
  if (value) {
    if (!current.includes(key)) {
      emit('update:selectedModules', [...current, key])
    }
    return
  }
  if (current.includes(key)) {
    emit('update:selectedModules', current.filter(item => item !== key))
  }
}
</script>

<template>
  <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="flex items-center gap-3 text-slate-900 mb-2">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-50)] border border-[var(--brand-100)] shadow-sm">
        <UIcon
          name="lucide:blocks"
          class="h-5 w-5 text-[var(--brand-600)]"
        />
      </div>
      <div>
        <p class="text-base font-bold tracking-tight">
          Módulos del negocio
        </p>
        <p class="text-xs text-slate-500">
          Activa solo las herramientas que vayas a usar.
        </p>
      </div>
    </div>

    <div class="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="module in OPTIONAL_MODULES"
        :key="module.key"
        class="group relative flex items-start space-x-3 rounded-2xl border p-4 transition-all duration-200"
        :class="selectedModules.includes(module.key) ? 'border-[var(--brand-200)] bg-[var(--brand-50)]/50 ring-1 ring-[var(--brand-500)]/20' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 cursor-pointer'"
        @click="!loading && setModule(module.key, !selectedModules.includes(module.key), selectedModules)"
      >
        <div class="flex h-6 items-center">
          <UCheckbox
            :model-value="selectedModules.includes(module.key)"
            :disabled="loading"
            class="pointer-events-none"
            :ui="{ base: 'h-5 w-5 bg-white border-slate-300' }"
          />
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-bold text-slate-900 transition-colors" :class="selectedModules.includes(module.key) ? 'text-[var(--brand-700)]' : ''">
            {{ module.label }}
          </span>
          <span class="text-xs text-slate-500 line-clamp-2 mt-0.5">
            {{ module.description }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
