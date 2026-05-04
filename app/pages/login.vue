<script setup lang="ts">
</script>

<template>
  <main class="relative min-h-screen overflow-y-auto text-slate-900 flex items-center justify-center bg-transparent">
    <section class="relative z-10 mx-auto flex w-full max-w-screen-xl flex-col gap-8 px-6 py-8 lg:gap-16">
      <header class="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
            <UIcon
              name="lucide:book-open"
              class="h-5 w-5"
            />
          </div>
          <div>
            <h1 class="text-xl font-black tracking-tight text-slate-900">
              Mi Contabilidad
            </h1>
            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Sistema de Gestión
            </p>
          </div>
        </div>
        <span class="rounded-full border border-slate-200/80 bg-white/50 px-4 py-1.5 text-xs font-bold tracking-wide text-slate-600 shadow-sm backdrop-blur-md">
          Acceso Seguro
        </span>
      </header>

      <div class="grid gap-12 lg:grid-cols-[1.1fr_1fr] items-center">
        <div class="relative z-10 order-2 lg:order-1">
          <LoginHero />
        </div>
        <div class="relative z-10 order-1 lg:order-2">
          <LoginForm />
        </div>
      </div>
    </section>
  </main>
</template>
