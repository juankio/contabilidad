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
  <div
    v-bind="attrs"
    class="rounded-3xl bg-white p-5 shadow-sm"
  >
    <div class="mb-4">
      <p class="text-sm font-semibold text-slate-800">
        Resumen por perfil
      </p>
      <p class="text-xs text-slate-500">
        Totales de gastos de cada perfil activo.
      </p>
    </div>

    <div
      v-if="pending"
      class="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500"
    >
      Cargando resumen por perfil...
    </div>
    <div
      v-else-if="error"
      class="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-500"
    >
      No se pudo cargar el resumen por perfil.
    </div>
    <div
      v-else-if="!(groups?.length)"
      class="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500"
    >
      Aun no hay gastos por perfil.
    </div>
    <div
      v-else
      class="grid gap-3 sm:grid-cols-2"
    >
      <section
        v-for="group in groups"
        :key="group.profileId"
        class="rounded-2xl border border-slate-100 p-4"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="flex min-w-0 items-center gap-2">
            <span
              class="h-3 w-3 rounded-full"
              :style="{ backgroundColor: group.avatarColor }"
            />
            <p class="truncate text-sm font-semibold text-slate-800">
              {{ group.profileName }}
            </p>
          </div>
          <p class="shrink-0 whitespace-nowrap text-sm font-semibold text-amber-600">
            -{{ props.formatCurrency(group.total) }}
          </p>
        </div>

        <div class="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div class="rounded-xl bg-slate-50 px-3 py-2">
            <p class="text-[11px] leading-tight text-slate-500">
              Movimientos
            </p>
            <p class="mt-1 font-semibold text-slate-800">
              {{ group.gastos.length }}
            </p>
          </div>
          <div class="rounded-xl bg-slate-50 px-3 py-2">
            <p class="text-[11px] leading-tight text-slate-500">
              Ultimo gasto
            </p>
            <p class="mt-1 font-semibold text-slate-800">
              {{ group.gastos[0] ? props.formatDate(group.gastos[0].date) : '-' }}
            </p>
          </div>
        </div>

        <div class="mt-3">
          <button
            type="button"
            class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            @click="openGroupModal(group)"
          >
            Ver movimientos
          </button>
        </div>
      </section>
    </div>
  </div>

  <div
    v-if="selectedGroup"
    class="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"
    @click.self="closeGroupModal"
  >
    <div class="w-full max-w-2xl rounded-3xl bg-white p-5 shadow-xl">
      <div class="mb-4 flex items-center justify-between">
        <div class="min-w-0">
          <p class="truncate text-lg font-semibold text-slate-900">
            Movimientos de {{ selectedGroup.profileName }}
          </p>
          <p class="text-xs text-slate-500">
            {{ selectedGroup.gastos.length }} gastos registrados
          </p>
        </div>
        <button
          class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
          @click="closeGroupModal"
        >
          Cerrar
        </button>
      </div>

      <div class="grid max-h-[65vh] gap-3 overflow-y-auto pr-1">
        <div
          v-for="gasto in selectedGroup.gastos"
          :key="`group-modal-${selectedGroup.profileId}-${gasto._id}`"
          class="rounded-2xl border border-slate-100 px-4 py-3"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <p class="break-words text-sm font-semibold text-slate-800">
                {{ gasto.description }}
              </p>
              <p class="mt-1 text-xs text-slate-500">
                {{ gasto.category }} · {{ props.formatDate(gasto.date) }}
              </p>
            </div>
            <p class="shrink-0 whitespace-nowrap text-sm font-semibold text-amber-600">
              -{{ props.formatCurrency(gasto.amount) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
