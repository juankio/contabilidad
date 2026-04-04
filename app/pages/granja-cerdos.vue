<script setup lang="ts">
definePageMeta({
  requiresModule: 'granja-cerdos'
})

const { activeProfileName } = useProfile()
const profileInitial = computed(() => activeProfileName.value?.trim().charAt(0).toUpperCase() || 'M')
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-5xl px-4 pb-10 pt-6">
      <header class="anim-up rounded-3xl bg-white p-5 shadow-sm">
        <div class="flex items-center gap-3">
          <div
            class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm"
            style="background: var(--brand-600)"
          >
            <span class="text-sm font-bold text-white">
              {{ profileInitial }}
            </span>
            <span class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-700">
              <UIcon
                name="lucide:paw-print"
                class="h-3 w-3 text-white"
              />
            </span>
          </div>
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
              Módulo
            </p>
            <h1 class="text-lg font-semibold text-slate-900">
              Granja de cerdos
            </h1>
          </div>
        </div>
        <p class="mt-3 text-sm text-slate-500">
          Controla animales, alimentación, peso y ventas.
        </p>
      </header>

      <div class="anim-up-1 mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        Este módulo está preparado para registrar lotes, crecimiento y movimientos.
      </div>
    </section>
  </main>
</template>
