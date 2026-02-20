<script setup lang="ts">
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

const selectedProfileId = ref('all')

const visibleGroups = computed(() => {
  if (!props.groups) {
    return []
  }
  if (selectedProfileId.value === 'all') {
    return props.groups
  }
  return props.groups.filter(group => group.profileId === selectedProfileId.value)
})
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm">
    <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <p class="text-sm font-semibold text-slate-800">
        Gastos por perfil
      </p>
      <div class="max-w-full overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div class="inline-flex min-w-full items-center gap-2">
          <button
            type="button"
            class="rounded-full px-3 py-1 text-xs font-medium"
            :class="selectedProfileId === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'"
            @click="selectedProfileId = 'all'"
          >
            Todos
          </button>
          <button
            v-for="group in groups ?? []"
            :key="group.profileId"
            type="button"
            class="rounded-full px-3 py-1 text-xs font-medium"
            :class="selectedProfileId === group.profileId ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'"
            @click="selectedProfileId = group.profileId"
          >
            {{ group.profileName }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="pending"
      class="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500"
    >
      Cargando gastos por perfil...
    </div>
    <div
      v-else-if="error"
      class="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-500"
    >
      No se pudieron cargar los gastos por perfil.
    </div>
    <div
      v-else-if="!visibleGroups.length"
      class="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500"
    >
      Aun no hay gastos para mostrar.
    </div>
    <div
      v-else
      class="grid gap-4"
    >
      <section
        v-for="group in visibleGroups"
        :key="group.profileId"
        class="rounded-2xl border border-slate-100 p-4"
      >
        <div class="mb-3 flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span
              class="h-3 w-3 rounded-full"
              :style="{ backgroundColor: group.avatarColor }"
            />
            <p class="text-sm font-semibold text-slate-800">
              {{ group.profileName }}
            </p>
          </div>
          <p class="text-sm font-semibold text-amber-600">
            -{{ formatCurrency(group.total) }}
          </p>
        </div>

        <div class="grid gap-2 md:grid-cols-2">
          <div
            v-for="gasto in group.gastos.slice(0, 6)"
            :key="gasto._id"
            class="rounded-xl bg-slate-50 px-3 py-2"
          >
            <p class="break-words text-sm font-medium text-slate-800">
              {{ gasto.description }}
            </p>
            <p class="text-xs text-slate-500">
              {{ gasto.category }} · {{ formatDate(gasto.date) }}
            </p>
            <p class="mt-1 text-xs font-semibold text-amber-600">
              -{{ formatCurrency(gasto.amount) }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
