<script setup lang="ts">
import type { Lote } from '../../composables/granja/useGranjaCerdos'

const props = defineProps<{
  lote: Lote
}>()

const emit = defineEmits<{
  (e: 'edit', lote: Lote): void
  (e: 'delete', lote: Lote): void
}>()

const getDropdownItems = () => [
  [{
    label: 'Editar',
    icon: 'lucide:pencil',
    onSelect: () => emit('edit', props.lote)
  }],
  [{
    label: 'Eliminar',
    icon: 'lucide:trash-2',
    color: 'error',
    onSelect: () => emit('delete', props.lote)
  }]
]
</script>

<template>
  <div class="lote-item p-4 rounded-2xl bg-transparent border border-slate-100 hover:bg-transparent transition-colors">
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
            :items="getDropdownItems()"
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
</template>
