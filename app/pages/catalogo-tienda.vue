<script setup lang="ts">
definePageMeta({
  requiresModule: 'catalogo-tienda'
})
</script>

<template>
  <main class="min-h-screen bg-transparent text-slate-900">
    <section class="mx-auto max-w-screen-2xl overflow-x-clip px-4 pb-10 pt-6">
      <header class="anim-up rounded-3xl bg-white p-5 shadow-sm">
        <div class="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm"
              style="background: var(--brand-600)"
            >
              <UIcon
                name="lucide:store"
                class="h-5 w-5 text-white"
              />
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Módulo
              </p>
              <h1 class="text-2xl font-bold tracking-tight text-slate-900">
                Catálogo de tienda
              </h1>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <UButton
              color="neutral"
              variant="soft"
              icon="lucide:arrow-left"
              class="rounded-xl px-5 font-medium transition-colors hover:bg-slate-100 w-full md:w-auto justify-center"
              to="/"
            >
              Volver
            </UButton>
          </div>
        </div>
        <p class="text-sm text-slate-500">
          Administra productos, precios y stock.
        </p>
      </header>

      <div class="anim-up-1 mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        Este módulo está listo para crecer con productos, variantes y control de inventario.
      </div>
    </section>
  </main>
</template>
