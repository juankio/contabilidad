<script setup lang="ts">
import { useProfile } from '../../composables/useProfile'

defineProps<{
  profileName: string
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'rename'): void
}>()

const { activeProfileIcon } = useProfile()
</script>

<template>
  <div class="h-full rounded-2xl border border-slate-200 bg-white p-4">
    <div class="flex items-center gap-2 text-slate-700">
      <UIcon
        name="lucide:id-card"
        class="h-4 w-4"
      />
      <p class="text-sm font-semibold">
        Perfil actual
      </p>
    </div>

    <!-- Vista previa del perfil -->
    <div class="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style="background: var(--brand-600)"
      >
        <UIcon
          :name="activeProfileIcon || 'i-lucide-user'"
          class="h-5 w-5 text-white"
        />
      </div>
      <div class="min-w-0">
        <p class="truncate text-2xl font-bold tracking-tight text-slate-900">
          {{ profileName || 'Sin nombre' }}
        </p>
        <div class="mt-0.5 flex items-center gap-1.5">
          <span
            class="inline-block h-2 w-2 rounded-full"
            style="background: var(--brand-600)"
          />
          <span class="text-xs text-slate-500">Nombre · Ícono · Color</span>
        </div>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between gap-2">
      <p class="text-xs text-slate-500">
        Edita el nombre, ícono y color desde el mismo lugar.
      </p>
      <UButton
        color="neutral"
        variant="soft"
        class="shrink-0 bg-slate-100 text-slate-700 hover:bg-slate-200"
        type="button"
        :disabled="loading"
        @click="emit('rename')"
      >
        Editar
      </UButton>
    </div>
  </div>
</template>
