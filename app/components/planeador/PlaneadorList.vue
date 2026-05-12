<script setup lang="ts">
import type { PlanCompra } from '../../composables/planeador/usePlaneador'
import { animate } from 'animejs'

defineProps<{
  planesPorMes: Array<{ mes: string, items: PlanCompra[] }>
  loading: boolean
  error?: string | null
  formatCurrency: (v: number) => string
  labelMes: (mes: string) => string
}>()

const emit = defineEmits<{
  toggle: [id: string]
  eliminar: [id: string]
  edit: [plan: PlanCompra]
}>()

const mesActual = new Date().toISOString().slice(0, 7)

// Brook's Animaciones con Anime.js
function onBeforeEnter(el: Element) {
  const htmlEl = el as HTMLElement
  htmlEl.style.opacity = '0'
  htmlEl.style.transform = 'translateY(10px)'
}

function onEnter(el: Element, done: () => void) {
  animate(el, {
    opacity: [0, 1],
    y: [10, 0],
    duration: 350,
    ease: 'outElastic(1, .8)',
    onComplete: done
  })
}

function onLeave(el: Element, done: () => void) {
  animate(el, {
    opacity: 0,
    x: 24,
    duration: 200,
    ease: 'inQuad',
    onComplete: done
  })
}
</script>

<template>
  <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <!-- Header -->
    <div class="anim-up mb-5 flex items-center justify-between">
      <div>
        <div class="flex items-center gap-2 text-slate-700">
          <UIcon
            name="lucide:list"
            class="h-4 w-4"
          />
          <p class="text-sm font-semibold">
            Mis planes
          </p>
        </div>
        <p class="mt-1 text-xs text-slate-400">
          Agrupado por mes
        </p>
        <h2 class="mt-0.5 text-lg font-bold tracking-tight text-slate-900">
          Compras planeadas
        </h2>
      </div>
    </div>

    <!-- Skeleton shimmer -->
    <PlaneadorSkeleton v-if="loading" />

    <!-- Error -->
    <div
      v-else-if="error"
      class="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600"
    >
      {{ error }}
    </div>

    <!-- Empty state -->
    <PlaneadorEmptyState v-else-if="planesPorMes.length === 0" />

    <!-- Lista agrupada -->
    <div
      v-else
      class="space-y-6"
    >
      <div
        v-for="grupo in planesPorMes"
        :key="grupo.mes"
      >
        <!-- Cabecera de mes -->
        <div class="mb-3 flex items-center gap-2">
          <span
            class="rounded-full px-3 py-0.5 text-xs font-semibold capitalize transition-colors duration-200"
            :class="grupo.mes === mesActual ? '' : 'bg-slate-100 text-slate-500'"
            :style="grupo.mes === mesActual ? { background: 'var(--brand-100)', color: 'var(--brand-700)' } : {}"
          >
            {{ labelMes(grupo.mes) }}
            <span
              v-if="grupo.mes === mesActual"
              class="ml-1 opacity-60"
            >· este mes</span>
          </span>
          <div class="flex-1 border-t border-slate-100" />
          <span class="shrink-0 text-xs tabular-nums text-slate-400">
            {{ formatCurrency(grupo.items.filter(i => !i.completado).reduce((a, i) => a + i.monto, 0)) }}
          </span>
        </div>

        <!-- Items con AnimeJS -->
        <TransitionGroup
          tag="div"
          name="plan"
          class="space-y-2 relative"
          @before-enter="onBeforeEnter"
          @enter="onEnter"
          @leave="onLeave"
        >
          <PlaneadorItem
            v-for="plan in grupo.items"
            :key="plan._id"
            :plan="plan"
            :format-currency="formatCurrency"
            @toggle="emit('toggle', $event)"
            @eliminar="emit('eliminar', $event)"
            @edit="emit('edit', $event)"
          />
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Transiciones posicionales manejadas por CSS (move) y Anime.js para enter/leave */
.plan-move { transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1); }
.plan-leave-active { position: absolute; width: 100%; }
</style>
