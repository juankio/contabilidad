<script setup lang="ts">
import { animate, stagger } from 'animejs'
import type { PlanCompra, NuevoPlan } from '../../composables/planeador/usePlaneador'

const props = defineProps<{
  planes: PlanCompra[]
  loading: boolean
  error?: string | null
  submitting: boolean
  submitError?: string | null
  planesPorMes: Array<{ mes: string, items: PlanCompra[] }>
  saldoDisponible: number
  formatCurrency: (val: number) => string
  labelMes: (mes: string) => string
}>()

const emit = defineEmits<{
  (e: 'crear', plan: NuevoPlan, onSuccess: () => void): void
  (e: 'editar', id: string, updates: Partial<NuevoPlan>, onSuccess: () => void): void
  (e: 'toggle', id: string): void
  (e: 'eliminar', id: string): void
}>()

const isEditOpen = ref(false)
const planAEditar = ref<PlanCompra | null>(null)

function openEdit(plan: PlanCompra) {
  planAEditar.value = plan
  isEditOpen.value = true
}

function handleEditar(updates: Partial<NuevoPlan>) {
  if (!planAEditar.value) return
  emit('editar', planAEditar.value._id, updates, () => {
    isEditOpen.value = false
    planAEditar.value = null
  })
}

onMounted(() => {
  if (!import.meta.client) return
  const elements = document.querySelectorAll('.anim-up')
  if (!elements.length) return

  animate(Array.from(elements), {
    y: [20, 0],
    opacity: [0, 1],
    duration: 350,
    ease: 'outExpo',
    delay: stagger(50)
  })
})
</script>

<template>
  <main class="min-h-screen bg-transparent text-slate-900">
    <div class="mx-auto max-w-screen-2xl overflow-x-clip px-4 pb-10 pt-6">
      <header class="anim-up rounded-3xl bg-white p-5 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-4 sm:gap-5">
          <div class="relative shrink-0">
            <div class="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-[var(--brand-500)] to-[var(--brand-600)] shadow-sm text-white">
              <UIcon name="lucide:target" class="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">Planeador</p>
            <h1 class="text-2xl font-bold tracking-tight text-slate-900">Metas y Compras</h1>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <UButton
            color="neutral"
            variant="soft"
            icon="lucide:arrow-left"
            class="rounded-xl px-5 font-medium transition-colors hover:bg-slate-100 w-full md:w-auto justify-center"
            to="/"
          >
            Volver
          </UButton>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="anim-up lg:col-span-4 lg:sticky lg:top-8 flex flex-col gap-6">
          <PlaneadorResumen
            :planes="planes"
            :saldo-disponible="saldoDisponible"
            :format-currency="formatCurrency"
          />
          <PlaneadorForm
            :submitting="submitting"
            :submit-error="submitError"
            @submit="(nuevo: NuevoPlan, onOk: () => void) => emit('crear', nuevo, onOk)"
          />
        </div>

        <div class="anim-up lg:col-span-8">
          <PlaneadorList
            :planes-por-mes="planesPorMes"
            :loading="loading"
            :error="error"
            :format-currency="formatCurrency"
            :label-mes="labelMes"
            @toggle="emit('toggle', $event)"
            @edit="openEdit"
            @delete="emit('eliminar', $event)"
          />
        </div>
      </div>
    </div>

    <PlaneadorEditModal
      :model-value="isEditOpen"
      :plan="planAEditar"
      :submitting="submitting"
            :submit-error="submitError"
            @update:model-value="isEditOpen = $event"
            @submit="(id: string, updates: Partial<NuevoPlan>) => handleEditar(updates)"
          />
  </main>
</template>