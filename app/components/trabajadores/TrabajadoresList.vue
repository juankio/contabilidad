<script setup lang="ts">
import { watch, nextTick } from 'vue'
import { animate, stagger } from 'animejs'
import type { Trabajador } from '../../composables/trabajadores/useTrabajadores'
import TrabajadorCard from './TrabajadorCard.vue'
import TrabajadorSkeleton from './TrabajadorSkeleton.vue'

const props = defineProps<{
  trabajadores: Trabajador[]
  loading: boolean
  formatCurrency: (value: number) => string
}>()

const emit = defineEmits<{
  (e: 'edit', trabajador: Trabajador): void
  (e: 'delete', trabajador: Trabajador): void
}>()

watch(() => props.loading, async (newVal) => {
  if (!newVal) {
    await nextTick()
    if (!import.meta.client) return;
    const targets = Array.from(document.querySelectorAll('.trabajador-item-anim'))
    if (targets.length) {
      animate(targets, {
        y: [20, 0],
        opacity: [0, 1],
        duration: 500,
        delay: stagger(50),
        ease: 'outQuad'
      })
    }
  }
}, { immediate: true })
</script>

<template>
  <div class="anim-up-3 mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <div class="mb-5 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-50)] text-[var(--brand-600)] ring-1 ring-[var(--brand-500)]/20">
          <UIcon
            name="lucide:users"
            class="h-5 w-5"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Plantilla Actual
          </h2>
          <p class="text-sm text-slate-500">
            Personal activo de la empresa.
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="loading"
      class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      <TrabajadorSkeleton
        v-for="i in 3"
        :key="i"
        class="trabajador-item-anim"
      />
    </div>
    <div
      v-else-if="trabajadores.length === 0"
      class="trabajador-item-anim flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-8 text-center"
    >
      <UIcon
        name="lucide:inbox"
        class="mb-2 h-8 w-8 text-slate-300"
      />
      <p class="text-sm font-medium text-slate-600">
        No hay trabajadores
      </p>
      <p class="text-xs text-slate-500">
        Agrega el primero para empezar.
      </p>
    </div>
    <div
      v-else
      class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      <TrabajadorCard
        v-for="t in trabajadores"
        :key="t._id"
        class="trabajador-item-anim"
        :trabajador="t"
        :format-currency="formatCurrency"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
    </div>
  </div>
</template>
