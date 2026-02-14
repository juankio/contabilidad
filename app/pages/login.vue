<script setup lang="ts">
import LoginHero from '../components/auth/LoginHero.vue'
import LoginForm from '../components/auth/LoginForm.vue'
import LoginPattern from '../components/backgrounds/LoginPattern.vue'
</script>

<template>
  <main class="relative min-h-screen overflow-hidden bg-white text-slate-900">
    <LoginPattern class="pointer-events-none absolute inset-0 z-0 h-full w-full" />
    <section class="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 py-16 lg:justify-center">
      <header class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-slate-400">
            Acceso
          </p>
          <h1 class="text-3xl font-semibold text-slate-900">
            Contabilidad
          </h1>
        </div>
        <span class="text-sm text-slate-500">Panel privado</span>
      </header>

      <div class="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div class="relative z-10">
          <LoginHero />
        </div>
        <div class="relative z-10">
          <LoginForm />
        </div>
      </div>
    </section>
  </main>
</template>
