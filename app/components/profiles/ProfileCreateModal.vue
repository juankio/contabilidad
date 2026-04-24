<script setup lang="ts">
import IconSelector from '../ui/IconSelector.vue'

defineProps<{
  open: boolean
  loading: boolean
  name: string
  icon: string
}>()

const emit = defineEmits<{
  (e: 'update:name', value: string): void
  (e: 'update:icon', value: string): void
  (e: 'update:open', value: boolean): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <Transition name="modal">
    <div
      v-if="open"
      class="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-sm"
      @click.self="emit('update:open', false); emit('close')"
    >
      <div class="anim-scale w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
        <div class="mb-4 flex items-center justify-between">
          <p class="text-base font-semibold text-slate-900">
            Crear Espacio de Trabajo
          </p>
          <UButton
            color="neutral"
            variant="ghost"
            icon="lucide:x"
            size="sm"
            @click="emit('update:open', false); emit('close')"
          >
    <div class="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
      <h3 class="text-2xl font-bold tracking-tight text-slate-900">
        Crear nuevo perfil
      </h3>
      <p class="mt-1 text-sm text-slate-600">
        Escribe un nombre para el perfil antes de crearlo.
      </p>

      <div class="mt-4">
        <UInput
          :model-value="name"
          type="text"
          size="lg"
          placeholder="Ej: Personal, Empresa ACME"
          maxlength="32"
          autofocus
          @update:model-value="emit('update:name', String($event ?? ''))"
        />
      </div>

      <div class="mt-4">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          Icono del perfil
        </p>
        <div class="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6">
          <button
            v-for="option in PROFILE_ICONS"
            :key="option.icon"
            type="button"
            class="flex items-center justify-center rounded-xl border p-2 transition"
            :class="icon === option.icon
              ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'"
            :disabled="loading"
            @click="emit('update:icon', option.icon)"
          >
            <UIcon
              :name="option.icon"
              class="h-5 w-5"
            />
          </button>
        </div>
        <div class="mt-2 text-xs text-slate-600">
          <span class="font-semibold text-slate-600">Actual:</span>
          <UIcon
            :name="icon || DEFAULT_PROFILE_ICON"
            class="ml-1 inline-block h-4 w-4"
          />
        </div>
      </div>

      <div class="mt-3 flex flex-wrap gap-2">
        <UButton
          color="neutral"
          variant="soft"
          size="xs"
          type="button"
          :disabled="loading"
          @click="emit('update:name', 'Personal')"
        >
          Personal
        </UButton>
        <UButton
          color="neutral"
          variant="soft"
          size="xs"
          type="button"
          :disabled="loading"
          @click="emit('update:name', 'Empresa')"
        >
          Empresa
        </UButton>
      </div>

      <div class="mt-5 flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          type="button"
          :disabled="loading"
          @click="emit('close')"
        >
          Cancelar
        </UButton>
        <UButton
          color="neutral"
          type="button"
          :loading="loading"
          :disabled="name.trim().length < 2"
          @click="emit('confirm')"
        >
          Crear perfil
        </UButton>
      </div>
    </div>
  </div>
</template>
