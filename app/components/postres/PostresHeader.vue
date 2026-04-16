<script setup lang="ts">
import { usePostres } from '../../composables/postres/usePostres'

const { postres, insumos, ventas } = usePostres()
const { activeProfileName } = useProfile()
const profileInitial = computed(() => activeProfileName.value?.trim().charAt(0).toUpperCase() || 'M')
</script>

<template>
  <header class="rounded-3xl bg-white p-4 shadow-sm mb-4">
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div
          class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm"
          style="background: var(--brand-600)"
        >
          <span class="text-sm font-bold text-white">
            {{ profileInitial }}
          </span>
          <span class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-700">
            <UIcon
              name="lucide:cake"
              class="h-3 w-3 text-white"
            />
          </span>
        </div>
        <div>
          <p class="text-sm uppercase tracking-[0.2em] text-slate-400">
            Módulo
          </p>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">
            Catálogo de postres
          </h1>
        </div>
      </div>

      <!-- Quick stats badges -->
      <div class="hidden items-center gap-2 sm:flex">
        <span class="flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-500">
          <UIcon
            name="lucide:cake"
            class="size-3.5 text-amber-400"
          />
          {{ postres.length }} postre{{ postres.length !== 1 ? 's' : '' }}
        </span>
        <span class="flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-500">
          <UIcon
            name="lucide:package"
            class="size-3.5 text-emerald-400"
          />
          {{ insumos.length }} insumo{{ insumos.length !== 1 ? 's' : '' }}
        </span>
        <span class="flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-500">
          <UIcon
            name="lucide:shopping-bag"
            class="size-3.5 text-sky-400"
          />
          {{ ventas.length }} venta{{ ventas.length !== 1 ? 's' : '' }}
        </span>
      </div>
    </div>
  </header>
</template>
