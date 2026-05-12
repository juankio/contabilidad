<script setup lang="ts">
import { animate, stagger } from 'animejs'

defineOptions({
  inheritAttrs: false
})

type Gasto = {
  _id: string
  description: string
  category: string
  amount: number
  date: string
}

type ProfileGastosGroup = {
  profileId: string
  profileName: string
  avatarColor: string
  total: number
  gastos: Gasto[]
}

const props = defineProps<{
  groups: ProfileGastosGroup[] | null | undefined
  pending: boolean
  error: boolean
  formatCurrency: (value: number) => string
  formatDate: (value: string) => string
}>()

watch(
  () => props.pending,
  async (isPending) => {
    if (!isPending && props.groups?.length) {
      await nextTick()
      if (!import.meta.client) return
      const elements = document.querySelectorAll('.profile-list-item')
      if (elements.length) {
        animate(Array.from(elements), {
          y: [20, 0],
          opacity: [0, 1],
          duration: 600,
          delay: stagger(100),
          ease: 'outExpo'
        })
      }
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 lg:col-span-4 min-w-0 w-full overflow-hidden">
    <div class="mb-6 flex items-start justify-between min-w-0">
      <div class="flex items-center gap-3 sm:gap-4 min-w-0">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand-600)] ring-1 ring-[var(--brand-500)]/20">
          <UIcon
            name="lucide:users"
            class="h-6 w-6"
          />
        </div>
        <div class="min-w-0">
          <h2 class="text-lg font-bold tracking-tight text-slate-900 truncate">
            Resumen de perfiles
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 truncate">
            Desglose de gastos
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="pending"
      class="space-y-4"
    >
      <div
        v-for="i in 2"
        :key="i"
        class="flex items-center justify-between p-3"
      >
        <div class="flex items-center gap-3">
          <USkeleton class="h-10 w-10 rounded-full" />
          <USkeleton class="h-4 w-24 rounded-md" />
        </div>
        <USkeleton class="h-5 w-20 rounded-md" />
      </div>
    </div>

    <p
      v-else-if="error"
      class="text-sm font-medium text-rose-500"
    >
      No se pudo cargar el resumen.
    </p>

    <div
      v-else-if="!groups?.length"
      class="flex flex-col items-center justify-center py-6 text-center"
    >
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
        <UIcon
          name="lucide:pie-chart"
          class="h-6 w-6"
        />
      </div>
      <p class="text-sm font-semibold text-slate-700">
        Aún no hay datos
      </p>
      <p class="text-xs text-slate-500 max-w-[200px] mx-auto mt-1">
        Registra gastos para ver el resumen
      </p>
    </div>

    <ul
      v-else
      class="space-y-3"
    >
      <li
        v-for="g in groups"
        :key="g.profileName"
        class="profile-list-item flex items-center justify-between rounded-2xl border border-slate-100 bg-transparent p-3 min-w-0 gap-2"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm text-white"
            :style="{ backgroundColor: g.avatarColor }"
          >
            <UIcon
              :name="'lucide:user'"
              class="h-5 w-5"
            />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-bold text-slate-900 truncate">
              {{ g.profileName }}
            </p>
          </div>
        </div>
        <p class="text-sm sm:text-base font-bold text-slate-900 shrink-0 tabular-nums truncate">
          {{ formatCurrency(g.total) }}
        </p>
      </li>
    </ul>
  </div>
</template>
