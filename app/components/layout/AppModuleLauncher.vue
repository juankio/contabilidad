<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

type LauncherApp = NavigationMenuItem & {
  description: string
  moduleKey: string
}

defineProps<{
  apps: LauncherApp[]
}>()

const open = ref(false)
</script>

<template>
  <UPopover
    v-model:open="open"
    :content="{ side: 'bottom', align: 'end', sideOffset: 8 }"
  >
    <button
      type="button"
      class="flex h-10 items-center gap-2 rounded-full px-4 text-[15px] font-bold tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 text-slate-500 hover:text-slate-900 hover:bg-slate-50 shrink-0"
    >
      <UIcon
        name="lucide:layout-grid"
        class="size-5 shrink-0"
      />
      <span>Módulos</span>
    </button>

    <template #content>
      <div class="w-[420px] p-4 bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-xl border border-slate-100/80">
        <div class="mb-4 px-2">
          <h3 class="text-sm font-bold tracking-tight text-slate-900">
            Tus Módulos
          </h3>
          <p class="text-xs font-medium text-slate-500">
            Herramientas activas en este espacio.
          </p>
        </div>

        <div
          v-if="apps.length === 0"
          class="py-8 text-center flex flex-col items-center gap-2"
        >
          <UIcon
            name="lucide:blocks"
            class="size-8 text-slate-200"
          />
          <p class="text-xs font-semibold text-slate-400">
            No hay módulos extra activados.
          </p>
        </div>

        <div
          v-else
          class="grid grid-cols-2 gap-2"
        >
          <NuxtLink
            v-for="app in apps"
            :key="app.moduleKey"
            :to="app.to"
            class="group flex flex-col items-start gap-1 rounded-2xl border border-transparent p-3 transition-all hover:bg-slate-50 hover:border-slate-100 active:scale-95"
            @click="open = false"
          >
            <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--brand-50)] text-[var(--brand-600)] ring-1 ring-inset ring-[var(--brand-500)]/20 shadow-sm transition-transform group-hover:scale-110">
              <UIcon
                :name="String(app.icon)"
                class="size-4"
              />
            </div>
            <div class="mt-1">
              <p class="text-sm font-bold text-slate-900 group-hover:text-[var(--brand-700)] transition-colors">
                {{ app.label }}
              </p>
              <p class="text-[10px] text-slate-500 font-medium line-clamp-2 leading-tight">
                {{ app.description }}
              </p>
            </div>
          </NuxtLink>
        </div>

        <div class="mt-3 border-t border-slate-100 pt-3 px-2">
          <NuxtLink
            to="/perfil"
            class="flex items-center gap-2 text-xs font-bold text-[var(--brand-600)] hover:text-[var(--brand-700)] transition-colors"
            @click="open = false"
          >
            <UIcon
              name="lucide:settings-2"
              class="size-4"
            />
            Activar más módulos
          </NuxtLink>
        </div>
      </div>
    </template>
  </UPopover>
</template>
