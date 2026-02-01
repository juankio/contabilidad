<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-4xl px-4 pb-10 pt-6">
      <div class="rounded-3xl bg-white p-5 shadow-sm">
        <h1 class="text-2xl font-semibold">
          Reportes
        </h1>
        <p class="mt-2 text-sm text-slate-500">
          Exporta tus movimientos a Excel o revisa el resumen mensual.
        </p>
        <div class="mt-4 flex flex-wrap gap-3">
          <button class="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white">
            Exportar todo
          </button>
          <button class="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600">
            Exportar mes actual
          </button>
        </div>
      </div>

      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <div class="rounded-3xl bg-white p-5 shadow-sm">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
            Resumen
          </p>
          <p class="mt-2 text-lg font-semibold">
            Agosto 2024
          </p>
          <p class="mt-2 text-sm text-slate-500">
            Ingresos $18,240 · Gastos $6,930
          </p>
        </div>
        <div class="rounded-3xl bg-white p-5 shadow-sm">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
            Categorias
          </p>
          <p class="mt-2 text-sm text-slate-500">
            Alimentacion, Servicios, Transporte, Salud.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>
