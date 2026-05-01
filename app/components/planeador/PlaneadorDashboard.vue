<script setup lang="ts">
import { computed, ref } from 'vue'
import PlaneadorResumen from './PlaneadorResumen.vue'
import PlaneadorForm from './PlaneadorForm.vue'
import PlaneadorList from './PlaneadorList.vue'
import PlaneadorEditModal from './PlaneadorEditModal.vue'
import type { PlanCompra, NuevoPlan } from '../../composables/planeador/usePlaneador'

const props = defineProps<{
  planes: PlanCompra[]
  loading: boolean
  error: string | null
  submitting: boolean
  submitError: string | null
  planesPorMes: Array<{ mes: string, items: PlanCompra[] }>
  saldoDisponible: number
  formatCurrency: (val: number) => string
  labelMes: (key: string) => string
}>()

const emit = defineEmits<{
  (e: 'crear', nuevo: NuevoPlan, onSuccess: () => void): void
  (e: 'editar', id: string, updates: Partial<NuevoPlan>, onSuccess: () => void): void
  (e: 'toggle', id: string): void
  (e: 'eliminar', id: string): void
}>()

const { activeProfileName } = useProfile()
const profileInitial = computed(() => activeProfileName.value?.trim().charAt(0).toUpperCase() || 'M')

const formRef = ref<InstanceType<typeof PlaneadorForm> | null>(null)
const editingPlan = ref<PlanCompra | null>(null)
const isEditModalOpen = ref(false)

const totalCompletado = computed(() => props.planes.filter(p => p.completado).length)
const totalPendiente = computed(() => props.planes.filter(p => !p.completado).length)

function onEdit(plan: PlanCompra) {
  editingPlan.value = plan
  isEditModalOpen.value = true
}

function handleCrear(nuevo: NuevoPlan) {
  emit('crear', nuevo, () => {
    if (formRef.value) formRef.value.reset()
  })
}

function handleEditar(id: string, updates: Partial<NuevoPlan>) {
  emit('editar', id, updates, () => {
    isEditModalOpen.value = false
  })
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-screen-2xl px-4 pb-12 pt-6">
      <header class="anim-up mb-6 rounded-3xl bg-white p-5 shadow-sm">
        <div class="flex flex-wrap items-start justify-between gap-4">
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
                  name="lucide:shopping-bag"
                  class="h-3 w-3 text-white"
                />
              </span>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Módulo
              </p>
              <h1 class="text-2xl font-bold tracking-tight text-slate-900">
                Planeador de compras
              </h1>
              <p class="mt-0.5 text-xs text-slate-400">
                Planea con anticipación y controla tu presupuesto futuro.
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
              <p class="text-xs text-slate-400">Pendientes</p>
              <p class="mt-0.5 text-2xl font-bold tracking-tight text-violet-700">
                {{ totalPendiente }}
              </p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
              <p class="text-xs text-slate-400">Completados</p>
              <p class="mt-0.5 text-2xl font-bold tracking-tight text-emerald-600">
                {{ totalCompletado }}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div class="grid gap-6 lg:grid-cols-12 items-start">
        <div class="flex flex-col gap-6 lg:col-span-4">
          <PlaneadorResumen
            class="anim-up-1"
            :planes="planes"
            :saldo-disponible="saldoDisponible"
            :format-currency="formatCurrency"
          />
          <PlaneadorForm
            ref="formRef"
            class="anim-up-2"
            :submitting="submitting"
            :submit-error="submitError"
            @submit="handleCrear"
          />
        </div>

        <div class="lg:col-span-8 flex flex-col gap-6">
          <PlaneadorList
            class="anim-up-3"
            :planes-por-mes="planesPorMes"
            :loading="loading"
            :error="error"
            :format-currency="formatCurrency"
            :label-mes="labelMes"
            @toggle="(id) => emit('toggle', id)"
            @eliminar="(id) => emit('eliminar', id)"
            @edit="onEdit"
          />
        </div>
      </div>
    </section>

    <PlaneadorEditModal
      v-model="isEditModalOpen"
      :plan="editingPlan"
      :submitting="submitting"
      :submit-error="submitError"
      @submit="handleEditar"
    />
  </main>
</template>