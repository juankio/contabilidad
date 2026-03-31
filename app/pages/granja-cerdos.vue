<script setup lang="ts">
definePageMeta({
  requiresModule: 'granja-cerdos'
})
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-5xl px-4 pb-10 pt-6">
      <header class="anim-up rounded-3xl bg-white p-5 shadow-sm">
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm"
            style="background: var(--brand-600)"
          >
            <UIcon
              name="lucide:paw-print"
              class="h-5 w-5 text-white"
            />
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
