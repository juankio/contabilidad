<script setup lang="ts">
import { animate, stagger } from 'animejs'

const props = defineProps<{
  open: boolean
  loading: boolean
  name: string
  icon: string
  themeColor: string
}>()

const emit = defineEmits<{
  (e: 'update:name', value: string): void
  (e: 'update:icon', value: string): void
  (e: 'update:themeColor', value: string): void
  (e: 'update:open', value: boolean): void
  (e: 'confirm'): void
}>()

const isOpen = computed({
  get: () => props.open,
  set: val => emit('update:open', val)
})

watch(isOpen, async (val) => {
  if (val) {
    await nextTick()
    animate('.anim-modal-item', {
      y: [20, 0],
      opacity: [0, 1],
      duration: 600,
      ease: 'outExpo',
      delay: stagger(100, { start: 100 })
    })

    animate('.color-btn', {
      scale: [0, 1],
      opacity: [0, 1],
      duration: 500,
      ease: 'outBack',
      delay: stagger(30, { start: 300 })
    })
  }
})
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :ui="{ content: 'sm:max-w-md sm:rounded-3xl', overlay: 'bg-slate-900/40 backdrop-blur-sm' }"
  >
    <template #content>
      <div class="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-50)] text-[var(--brand-600)] ring-1 ring-[var(--brand-500)]/20 shadow-sm">
            <UIcon
              name="lucide:plus"
              class="h-5 w-5"
            />
          </div>
          <div>
            <h2 class="text-lg font-bold tracking-tight text-slate-900">
              Crear Espacio
            </h2>
            <p class="text-sm text-slate-500">
              Nuevo perfil contable.
            </p>
          </div>
        </div>
        <UButton
          color="neutral"
          variant="ghost"
          icon="lucide:x"
          class="-my-1"
          @click="emit('update:open', false)"
        />
      </div>

      <div class="p-6">
        <form
          class="grid gap-6"
          @submit.prevent="emit('confirm')"
        >
          <div class="anim-modal-item grid gap-2 text-sm opacity-0">
            <label
              for="newProfileName"
              class="font-bold text-slate-700"
            >Nombre del nuevo espacio</label>
            <UInput
              id="newProfileName"
              :model-value="name"
              type="text"
              required
              maxlength="32"
              size="lg"
              placeholder="Ej. Mi negocio 2"
              class="shadow-sm"
              :ui="{ base: 'font-medium text-slate-900' }"
              @update:model-value="emit('update:name', String($event ?? ''))"
            />
          </div>

          <div class="anim-modal-item grid gap-2 text-sm opacity-0">
            <label class="font-bold text-slate-700">Ícono representativo</label>
            <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <ProfileIconPicker
                :icon="icon"
                @update:icon="emit('update:icon', $event)"
              />
            </div>
          </div>

          <div class="anim-modal-item grid gap-2 text-sm opacity-0">
            <label class="font-bold text-slate-700">Color del tema</label>
            <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <ProfileColorPicker
                :color="themeColor"
                @update:color="emit('update:themeColor', $event)"
              />
            </div>
          </div>

          <div class="anim-modal-item mt-2 flex justify-end gap-3 opacity-0">
            <UButton
              color="neutral"
              variant="ghost"
              type="button"
              class="font-semibold px-4"
              :disabled="loading"
              @click="emit('update:open', false)"
            >
              Cancelar
            </UButton>
            <UButton
              color="primary"
              type="submit"
              class="font-semibold px-5 shadow-md transition-transform active:scale-95"
              :loading="loading"
              icon="lucide:check"
            >
              Crear perfil
            </UButton>
          </div>
        </form>
      </div>
    </template>
  </UModal>
</template>
