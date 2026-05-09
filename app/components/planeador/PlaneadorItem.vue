<script setup lang="ts">
import type { PlanCompra } from '../../composables/planeador/usePlaneador'

const props = defineProps<{
  plan: PlanCompra
  formatCurrency: (v: number) => string
}>()

const emit = defineEmits<{
  toggle: [id: string]
  eliminar: [id: string]
  edit: [plan: PlanCompra]
}>()

const confirmDeleteId = ref<string | null>(null)

function pedirConfirmacion() {
  confirmDeleteId.value = props.plan._id
}
function cancelarEliminar() {
  confirmDeleteId.value = null
}
function confirmarEliminar() {
  emit('eliminar', props.plan._id)
  confirmDeleteId.value = null
}
</script>

<template>
  <div
    class="group flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200"
    :class="plan.completado
      ? 'border-slate-100 bg-transparent/80 opacity-60'
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

    <!-- Acciones -->
    <div class="shrink-0 flex items-center gap-1">
      <Transition
        name="fade-quick"
        mode="out-in"
      >
        <div
          v-if="confirmDeleteId !== plan._id"
          class="flex items-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-150"
        >
          <button
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-full text-slate-300 transition-all duration-150 hover:bg-slate-100 hover:text-slate-600 active:scale-90"
            title="Editar plan"
            @click="emit('edit', plan)"
          >
            <UIcon
              name="lucide:pencil"
              class="h-3.5 w-3.5"
            />
          </button>
          <button
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-full text-slate-300 transition-all duration-150 hover:bg-rose-50 hover:text-rose-500 active:scale-90"
            title="Eliminar plan"
            @click="pedirConfirmacion"
          >
            <UIcon
              name="lucide:trash-2"
              class="h-3.5 w-3.5"
            />
          </button>
        </div>
        <div
          v-else
          class="flex items-center gap-1"
        >
          <button
            type="button"
            class="rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-semibold text-white transition-all duration-150 hover:bg-rose-600 active:scale-95"
            @click="confirmarEliminar"
          >
            Sí
          </button>
          <button
            type="button"
            class="rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-500 transition-all duration-150 hover:bg-transparent active:scale-95"
            @click="cancelarEliminar"
          >
            No
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
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
