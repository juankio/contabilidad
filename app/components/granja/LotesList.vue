<script setup lang="ts">
import type { Lote } from '../../composables/granja/useGranjaCerdos'

const props = defineProps<{
  lotes: Lote[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'edit', lote: Lote): void
  (e: 'delete', lote: Lote): void
}>()

const getDropdownItems = (lote: Lote) => [
  [{
    label: 'Editar',
    icon: 'lucide:pencil',
    onSelect: () => emit('edit', lote)
  }],
  [{
    label: 'Eliminar',
    icon: 'lucide:trash-2',
    color: 'error',
    onSelect: () => emit('delete', lote)
  }]
]
</script>

<template>
  <div class="anim-up-3 mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <div class="mb-5 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-50)] text-[var(--brand-600)] ring-1 ring-[var(--brand-500)]/20">
          <UIcon
            name="lucide:list"
            class="h-5 w-5"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Lotes Activos y Fichas
          </h2>
          <p class="text-sm text-slate-500">
            Lotes registrados en la granja.
          </p>
        </div>
      </div>
    </div>
    
    <div
      v-if="loading"
      class="grid gap-4 md:grid-cols-2"
    >
      <div
        v-for="i in 2"
        :key="i"
        class="p-4 rounded-2xl bg-slate-50/50 border border-slate-100"
      >
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center gap-3">
            <USkeleton class="h-10 w-10 shrink-0 rounded-xl" />
            <div class="space-y-2">
              <USkeleton class="h-4 w-24" />
              <USkeleton class="h-3 w-32" />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <USkeleton class="h-6 w-16 rounded-lg" />
            <USkeleton class="h-8 w-8 rounded-lg ml-2" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-4 border-t border-slate-100 pt-4">
          <div class="space-y-2">
            <USkeleton class="h-3 w-20 mb-2" />
            <USkeleton class="h-3 w-full" />
            <USkeleton class="h-3 w-3/4" />
          </div>
          <div class="space-y-2">
            <USkeleton class="h-3 w-24 mb-2" />
            <USkeleton class="h-3 w-full" />
          </div>
        </div>

        <div class="flex gap-2 mt-5">
          <USkeleton class="h-8 flex-1 rounded-md" />
          <USkeleton class="h-8 flex-1 rounded-md" />
        </div>
      </div>
    </div>
    <div
      v-else-if="lotes.length === 0"
      class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-8 text-center"
    >
      <UIcon
        name="lucide:inbox"
        class="mb-2 h-8 w-8 text-slate-300"
      />
      <p class="text-sm font-medium text-slate-600">
        No hay lotes registrados
      </p>
      <p class="text-xs text-slate-500">
        Registra el primero para empezar a controlar.
      </p>
    </div>
    <div
      v-else
      class="grid gap-4 md:grid-cols-2"
    >
      <div
        v-for="lote in lotes"
        :key="lote._id"
        class="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors"
      >
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
              <span class="text-sm font-bold text-primary">{{ lote.nombreLoteMadre.charAt(0).toUpperCase() }}</span>
            </div>
            <div>
              <p class="font-bold text-slate-900 line-clamp-1">
                {{ lote.nombreLoteMadre }}
              </p>
              <p class="text-xs text-slate-500">
                Llegada/Parto: {{ new Date(lote.fechaLlegada).toLocaleDateString() }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="bg-[var(--brand-100)] text-[var(--brand-700)] px-3 py-1 rounded-lg text-sm font-semibold whitespace-nowrap">
              {{ lote.cantidadActual }} vivos
            </div>
            <div class="ml-2">
              <UDropdownMenu
                :items="getDropdownItems(lote)"
                :popper="{ placement: 'bottom-end' }"
              >
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="lucide:more-vertical"
                  class="text-slate-400 hover:text-slate-600"
                />
              </UDropdownMenu>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm mt-4 border-t border-slate-100 pt-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Horarios Comida
            </p>
            <ul class="space-y-1 text-slate-600">
              <li
                v-for="(h, i) in lote.horariosComida || []"
                :key="i"
                class="flex items-center gap-1.5 text-xs"
              >
                <UIcon
                  name="lucide:clock"
                  class="h-3 w-3 text-slate-400"
                />
                <span>{{ h.hora }}: {{ h.cantidadKilos }}kg ({{ h.formula }})</span>
              </li>
              <li
                v-if="!(lote.horariosComida?.length)"
                class="text-xs italic text-slate-400"
              >
                Sin horarios
              </li>
            </ul>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Bajas (Muertes)
            </p>
            <ul class="space-y-1 text-slate-600">
              <li
                v-for="(m, i) in lote.muertes || []"
                :key="i"
                class="flex items-center gap-1.5 text-xs text-rose-600"
              >
                <UIcon
                  name="lucide:skull"
                  class="h-3 w-3"
                />
                <span>-{{ m.cantidad }} el {{ new Date(m.fecha).toLocaleDateString() }}</span>
              </li>
              <li
                v-if="!(lote.muertes?.length)"
                class="text-xs italic text-slate-400"
              >
                Cero muertes
              </li>
            </ul>
          </div>
        </div>

        <div class="flex gap-2 mt-5">
          <UButton
            size="xs"
            color="error"
            variant="soft"
            icon="lucide:skull"
            class="flex-1 justify-center"
          >
            Muerte
          </UButton>
          <UButton
            size="xs"
            color="warning"
            variant="soft"
            icon="lucide:wheat"
            class="flex-1 justify-center"
          >
            Comida
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
