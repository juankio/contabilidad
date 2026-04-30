<script setup lang="ts">
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
const attrs = useAttrs()

const selectedGroup = ref<ProfileGastosGroup | null>(null)

const openGroupModal = (group: ProfileGastosGroup) => {
  selectedGroup.value = group
}

const closeGroupModal = () => {
  selectedGroup.value = null
}
</script>

<template>
  <div class="rounded-[2rem] border border-white/60 bg-white/70 p-6 sm:p-8 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 lg:col-span-4">
    <div class="mb-6 flex items-start justify-between">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand-600)] ring-1 ring-[var(--brand-500)]/20">
          <UIcon
            name="lucide:users"
            class="h-6 w-6"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Resumen de perfiles
          </h2>
          <p class="text-sm text-slate-500">
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
        class="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm text-white"
            :style="{ backgroundColor: g.avatarColor }"
          >
            <UIcon
              :name="'lucide:user'"
              class="h-5 w-5"
            />
          </div>
          <div>
            <p class="text-sm font-bold text-slate-900">
              {{ g.profileName }}
            </p>
          </div>
        </div>
        <p class="text-base font-bold text-slate-900">
          {{ formatCurrency(g.total) }}
        </p>
      </li>
    </ul>
  </div>
</template>
