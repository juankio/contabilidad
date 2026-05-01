<script setup lang="ts">
import { watch, nextTick } from 'vue'
import { animate, stagger } from 'animejs'
import type { Lote } from '../../composables/granja/useGranjaCerdos'
import LoteItem from './LoteItem.vue'

const props = defineProps<{
  lotes: Lote[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'edit', lote: Lote): void
  (e: 'delete', lote: Lote): void
}>()

// Animación de entrada estilo cascada (stagger) para los lotes
watch([() => props.loading, () => props.lotes.length], async ([loading, length]) => {
  if (!loading && length > 0) {
    if (!import.meta.client) return
    await nextTick()
    animate('.lote-item', {
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 500,
      easing: 'easeOutExpo',
      delay: stagger(50)
    })
  }
}, { immediate: true })
</script>

<template>
  <div class="anim-up-3 mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <div class="mb-5 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-50)] text-[var(--brand-600)] ring-1 ring-[var(--brand-500)]/20">
          <UIcon
            name="lucide:list"
            class="h-5 w-5"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Lotes Activos y Fichas
          </h2>
          <p class="text-sm text-slate-500">
            Lotes registrados en la granja.
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="loading"
      class="grid gap-4 md:grid-cols-2"
    >
      <div
        v-for="i in 2"
        :key="i"
        class="p-4 rounded-2xl bg-slate-50/50 border border-slate-100"
      >
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center gap-3">
            <USkeleton class="h-10 w-10 shrink-0 rounded-xl" />
            <div class="space-y-2">
              <USkeleton class="h-4 w-24" />
              <USkeleton class="h-3 w-32" />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <USkeleton class="h-6 w-16 rounded-lg" />
            <USkeleton class="h-8 w-8 rounded-lg ml-2" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-4 border-t border-slate-100 pt-4">
          <div class="space-y-2">
            <USkeleton class="h-3 w-20 mb-2" />
            <USkeleton class="h-3 w-full" />
            <USkeleton class="h-3 w-3/4" />
          </div>
          <div class="space-y-2">
            <USkeleton class="h-3 w-24 mb-2" />
            <USkeleton class="h-3 w-full" />
          </div>
        </div>

        <div class="flex gap-2 mt-5">
          <USkeleton class="h-8 flex-1 rounded-md" />
          <USkeleton class="h-8 flex-1 rounded-md" />
        </div>
      </div>
    </div>
    <div
      v-else-if="lotes.length === 0"
      class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-8 text-center"
    >
      <UIcon
        name="lucide:inbox"
        class="mb-2 h-8 w-8 text-slate-300"
      />
      <p class="text-sm font-medium text-slate-600">
        No hay lotes registrados
      </p>
      <p class="text-xs text-slate-500">
        Registra el primero para empezar a controlar.
      </p>
    </div>
    <div
      v-else
      class="grid gap-4 md:grid-cols-2"
    >
      <LoteItem
        v-for="lote in lotes"
        :key="lote._id"
        :lote="lote"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
    </div>
  </div>
</template>
