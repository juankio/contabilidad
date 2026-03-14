<script setup lang="ts">
definePageMeta({
  requiresModule: 'catalogo-tienda'
})
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-5xl px-4 pb-10 pt-6">
      <header class="rounded-3xl bg-white p-5 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-600">
          Modulo
        </p>
        <h1 class="text-2xl font-semibold text-slate-900">
          Catalogo de tienda
        </h1>
        <p class="mt-2 text-sm text-slate-500">
          Administra productos, precios y stock.
        </p>
      </header>

      <div class="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        Este modulo esta listo para crecer con productos, variantes y control de inventario.
      </div>
    </section>
  </main>
</template>
