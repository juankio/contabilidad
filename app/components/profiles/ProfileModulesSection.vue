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
  <section class="rounded-2xl border border-slate-200 bg-white p-4">
    <div class="flex items-center gap-2 text-slate-700">
      <UIcon
        name="lucide:blocks"
        class="h-4 w-4"
      />
      <p class="text-sm font-semibold">
        Modulos del negocio
      </p>
    </div>

    <p class="mt-2 text-xs text-slate-600">
      Activa solo los modulos que uses en tu negocio.
    </p>

    <div class="mt-3 grid gap-2 md:grid-cols-2">
      <UCheckbox
        v-for="module in OPTIONAL_MODULES"
        :key="module.key"
        color="primary"
        variant="card"
        :label="module.label"
        :description="module.description"
        :model-value="selectedModules.includes(module.key)"
        :disabled="loading"
        @update:model-value="setModule(module.key, Boolean($event), selectedModules)"
      />
    </div>
  </section>
</template>
