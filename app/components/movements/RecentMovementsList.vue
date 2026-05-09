<script setup lang="ts">
import { animate, stagger } from 'animejs'
import type { MovimientoRow } from '../../composables/movimientos/useMovementCrud'

const props = defineProps<{
  pending: boolean
  error: any
  previewMovimientos: MovimientoRow[]
}>()

defineEmits<{
  (e: 'edit', mov: MovimientoRow): void
  (e: 'delete', mov: MovimientoRow): void
}>()

let listAnimation: any = null
let timeoutId: any = null

onBeforeUnmount(() => {
  if (timeoutId) clearTimeout(timeoutId)
  if (listAnimation) listAnimation.pause()
})

watch([() => props.previewMovimientos, () => props.pending], ([newMoves, isPending]) => {
  if (!import.meta.client) return // Evitar que anime.js explote en SSR (NodeList no definido)

  if (!isPending && newMoves && newMoves.length > 0) {
    nextTick(() => {
      if (timeoutId) clearTimeout(timeoutId)
      // Pequeño timeout para asegurar que el v-else-if cambió en el DOM
      timeoutId = setTimeout(() => {
        if (listAnimation) listAnimation.pause()
        if (!import.meta.client) return; const els = document.querySelectorAll('.movement-item-anim'); if (!els.length) return; listAnimation = animate(Array.from(els), {
          y: [20, 0],
          opacity: [0, 1],
          delay: stagger(50),
          duration: 800,
          ease: 'outElastic(1, .8)'
        })
      }, 50)
    })
  }
}, { immediate: true })
</script>

<template>
  <div class="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3 min-w-0">
    <template v-if="pending">
      <div
        v-for="i in 4"
        :key="i"
        class="flex items-center justify-between rounded-2xl p-3 border border-slate-100 bg-transparent"
      >
        <div class="flex items-center gap-3">
          <USkeleton class="h-10 w-10 rounded-xl" />
          <div class="space-y-2">
            <USkeleton class="h-4 w-24 rounded-md" />
            <USkeleton class="h-3 w-16 rounded-md" />
          </div>
        </div>
        <USkeleton class="h-5 w-16 rounded-md" />
      </div>
    </template>

    <template v-else-if="error || !previewMovimientos">
      <div class="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-transparent py-8 text-center px-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-400 mb-3">
          <UIcon
            name="lucide:alert-triangle"
            class="h-6 w-6"
          />
        </div>
        <p class="text-sm font-semibold text-rose-600">
          Error
        </p>
        <p class="mt-1 text-sm text-rose-500 max-w-[200px]">
          No pudimos cargar los movimientos.
        </p>
      </div>
    </template>

    <template v-else-if="previewMovimientos.length === 0">
      <div class="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-transparent py-8 text-center px-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
          <UIcon
            name="lucide:inbox"
            class="h-6 w-6"
          />
        </div>
        <p class="text-sm font-semibold text-slate-700">
          Sin movimientos
        </p>
        <p class="mt-1 text-sm text-slate-500 max-w-[200px]">
          Aún no hay transacciones en este perfil.
        </p>
      </div>
    </template>

    <template v-else>
      <div
        v-auto-animate
        class="space-y-2 relative"
      >
        <MovementItem
          v-for="movimiento in previewMovimientos"
          :key="movimiento._id"
          :movimiento="movimiento"
          class="movement-item-anim"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.mov-enter-active { transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1); }
.mov-leave-active { transition: all 0.18s ease; }
.mov-enter-from   { opacity: 0; transform: y(-8px); }
.mov-leave-to     { opacity: 0; transform: translateX(16px); }
.mov-move         { transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1); }
</style>
