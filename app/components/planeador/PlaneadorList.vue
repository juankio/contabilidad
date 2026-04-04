<script setup lang="ts">
import type { PlanCompra } from '../../composables/planeador/usePlaneador'

defineProps<{
  planesPorMes: Array<{ mes: string, items: PlanCompra[] }>
  loading: boolean
  error: string | null
  formatCurrency: (v: number) => string
  labelMes: (mes: string) => string
}>()

const emit = defineEmits<{
  toggle: [id: string]
  eliminar: [id: string]
}>()

const confirmDeleteId = ref<string | null>(null)

function pedirConfirmacion(id: string) {
  confirmDeleteId.value = id
}
function cancelarEliminar() {
  confirmDeleteId.value = null
}
function confirmarEliminar(id: string) {
  emit('eliminar', id)
  confirmDeleteId.value = null
}

const mesActual = new Date().toISOString().slice(0, 7)
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm">
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
        <h2 class="mt-0.5 text-3xl font-bold text-slate-900">
          Compras planeadas
        </h2>
      </div>
    </div>

    <!-- Skeleton shimmer -->
    <div
      v-if="loading"
      class="space-y-2"
    >
      <div
        v-for="i in 4"
        :key="i"
        class="skeleton h-14 w-full"
      />
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600"
    >
      {{ error }}
    </div>

    <!-- Empty state -->
    <div
      v-else-if="planesPorMes.length === 0"
      class="anim-fade grid place-items-center rounded-2xl border border-dashed border-slate-200 py-14 text-center"
    >
      <div
        class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
        style="background: var(--brand-50)"
      >
        <UIcon
          name="lucide:shopping-cart"
          class="h-6 w-6"
          :style="{ color: 'var(--brand-300)' }"
        />
      </div>
      <p class="text-sm font-medium text-slate-500">
        Sin planes aún
      </p>
      <p class="mt-1 text-xs text-slate-300">
        Agrega tu primera compra planeada.
      </p>
    </div>

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

        <!-- Items -->
        <TransitionGroup
          name="plan"
          tag="div"
          class="space-y-2"
        >
          <div
            v-for="plan in grupo.items"
            :key="plan._id"
            class="group flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200"
            :class="plan.completado
              ? 'border-slate-100 bg-slate-50/80 opacity-60'
              : 'plan-item-hover border-slate-100 bg-white hover:shadow-sm'"
          >
            <!-- Checkbox -->
            <button
              type="button"
              class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 active:scale-90"
              :class="plan.completado
                ? 'border-emerald-400 bg-emerald-400'
                : 'checkbox-hover border-slate-200'"
              @click="emit('toggle', plan._id)"
            >
              <Transition name="check">
                <UIcon
                  v-if="plan.completado"
                  name="lucide:check"
                  class="h-3 w-3 text-white"
                />
              </Transition>
            </button>

            <!-- Texto -->
            <div class="min-w-0 flex-1">
              <p
                class="truncate text-sm font-medium transition-all duration-200"
                :class="plan.completado
                  ? 'text-slate-400 line-through decoration-slate-300'
                  : 'text-slate-800 group-hover:text-slate-900'"
              >
                {{ plan.nombre }}
              </p>
              <p
                v-if="plan.descripcion"
                class="mt-0.5 truncate text-xs text-slate-400"
              >
                {{ plan.descripcion }}
              </p>
            </div>

            <!-- Monto -->
            <p
              class="shrink-0 text-sm font-semibold tabular-nums transition-colors duration-200"
              :class="plan.completado ? 'text-slate-400' : ''"
              :style="plan.completado ? {} : { color: 'var(--brand-700)' }"
            >
              {{ formatCurrency(plan.monto) }}
            </p>

            <!-- Eliminar -->
            <div class="shrink-0">
              <Transition name="fade-quick">
                <button
                  v-if="confirmDeleteId !== plan._id"
                  type="button"
                  class="flex h-7 w-7 items-center justify-center rounded-full text-slate-300 opacity-0 transition-all duration-150 hover:bg-rose-50 hover:text-rose-500 active:scale-90 group-hover:opacity-100"
                  @click="pedirConfirmacion(plan._id)"
                >
                  <UIcon
                    name="lucide:trash-2"
                    class="h-3.5 w-3.5"
                  />
                </button>
                <div
                  v-else
                  class="flex items-center gap-1"
                >
                  <button
                    type="button"
                    class="rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-semibold text-white transition-all duration-150 hover:bg-rose-600 active:scale-95"
                    @click="confirmarEliminar(plan._id)"
                  >
                    Sí
                  </button>
                  <button
                    type="button"
                    class="rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-500 transition-all duration-150 hover:bg-slate-50 active:scale-95"
                    @click="cancelarEliminar"
                  >
                    No
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Items de la lista */
.plan-enter-active { transition: all 0.32s cubic-bezier(0.22, 1, 0.36, 1); }
.plan-leave-active { transition: all 0.18s ease; }
.plan-enter-from   { opacity: 0; transform: translateY(-10px); }
.plan-leave-to     { opacity: 0; transform: translateX(24px); }
.plan-move         { transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1); }

/* Checkmark */
.check-enter-active { transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1); }
.check-leave-active { transition: all 0.1s ease; }
.check-enter-from   { opacity: 0; transform: scale(0.4); }
.check-leave-to     { opacity: 0; transform: scale(0.4); }

/* Botón eliminar */
.fade-quick-enter-active { transition: opacity 0.15s ease; }
.fade-quick-leave-active { transition: opacity 0.1s ease; }
.fade-quick-enter-from,
.fade-quick-leave-to     { opacity: 0; }

/* Brand hover states using CSS vars */
.plan-item-hover:hover {
  border-color: var(--brand-100);
  background: color-mix(in srgb, var(--brand-50) 20%, white);
}
.checkbox-hover:hover {
  border-color: var(--brand-400);
  background: var(--brand-50);
}
</style>
