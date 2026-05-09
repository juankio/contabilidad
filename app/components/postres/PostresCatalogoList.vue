<script setup lang="ts">
import { animate } from 'animejs'

const { postres, eliminar, loadingData, activePostreId, activePostre } = usePostres()
const toast = useToast()
const { formatCurrency } = useFormatters()

const deletePostre = async (id: string) => {
  if (!confirm('¿Eliminar postre?')) return
  try {
    await eliminar('postres', id)
    if (activePostreId.value === id) {
      activePostreId.value = ''
      activePostre.value = null
    }
    toast.add({ title: 'Postre eliminado', color: 'success' })
  } catch (err: unknown) {
    const errorMsg = err as Error
    toast.add({ title: 'Error al eliminar', description: errorMsg.message, color: 'error' })
  }
}

const selectPostre = (postre: any) => {
  activePostreId.value = postre._id
  activePostre.value = postre
}

function onBeforeEnter(el: Element) {
  const htmlEl = el as HTMLElement
  htmlEl.style.opacity = '0'
  htmlEl.style.transform = 'translateY(15px)'
}

function onEnter(el: Element, done: () => void) {
  animate(el, { opacity: [0, 1], y: [15, 0], duration: 400, ease: 'outExpo', onComplete: done })
}

function onLeave(el: Element, done: () => void) {
  animate(el, { opacity: 0, x: -20, duration: 300, ease: 'inExpo', onComplete: done })
}
</script>

<template>
  <div class="mt-6 flex-1 min-h-0">
    <ul
      v-if="loadingData"
      class="space-y-3 overflow-y-auto max-h-[40vh] md:max-h-[350px] pr-1"
    >
      <li
        v-for="i in 3"
        :key="i"
        class="flex items-center justify-between rounded-2xl border border-slate-100 bg-transparent p-3"
      >
        <div class="flex items-center gap-3">
          <USkeleton class="h-10 w-10 rounded-xl" />
          <div class="space-y-2">
            <USkeleton class="h-4 w-24 rounded-md" />
            <USkeleton class="h-3 w-12 rounded-md" />
          </div>
        </div>
        <USkeleton class="h-8 w-20 rounded-xl" />
      </li>
    </ul>
    <div
      v-else-if="!postres.length"
      class="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-transparent py-8 text-center px-4"
    >
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
        <UIcon
          name="lucide:cake"
          class="h-6 w-6"
        />
      </div>
      <p class="text-sm font-semibold text-slate-700">
        Sin catálogo
      </p>
      <p class="mt-1 text-sm text-slate-500 max-w-[200px]">
        Crea tu primer postre.
      </p>
    </div>
    <TransitionGroup
      v-else
      tag="ul"
      class="space-y-3 overflow-y-auto max-h-[40vh] md:max-h-[350px] pr-1 scrollbar-thin scrollbar-thumb-slate-200 relative"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @leave="onLeave"
    >
      <li
        v-for="postre in postres"
        :key="postre._id"
        class="group flex cursor-pointer items-center justify-between rounded-2xl border p-3 transition-colors hover:bg-slate-50"
        :class="activePostreId === postre._id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-100 bg-transparent'"
        @click="selectPostre(postre)"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100/80"
            :class="activePostreId === postre._id ? 'text-primary ring-primary/20' : 'text-slate-500'"
          >
            <UIcon
              name="lucide:cake"
              class="h-5 w-5"
            />
          </div>
          <div>
            <p class="text-sm font-bold text-slate-900">
              {{ postre.name }}
            </p>
            <p class="text-xs font-semibold text-slate-500">
              {{ postre.receta?.length || 0 }} insumos
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span
            class="rounded-xl bg-white px-3 py-1.5 text-sm font-bold tracking-tight shadow-sm ring-1 ring-inset"
            :class="activePostreId === postre._id ? 'text-primary ring-primary/30' : 'text-slate-700 ring-slate-200/60'"
          >
            {{ formatCurrency(postre.price) }}
          </span>
          <UButton
            color="error"
            variant="ghost"
            icon="lucide:trash-2"
            size="sm"
            class="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
            @click.stop="deletePostre(postre._id)"
          />
        </div>
      </li>
    </TransitionGroup>
  </div>
</template>
