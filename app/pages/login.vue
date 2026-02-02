<script setup lang="ts">
import LoginHero from '../components/auth/LoginHero.vue'
import LoginForm from '../components/auth/LoginForm.vue'
</script>

<template>
  <main class="min-h-screen bg-white text-slate-900">
    <section class="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-12">
      <header class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-slate-400">
            Acceso
          </p>
          <h1 class="text-2xl font-semibold text-slate-900">
            Contabilidad
          </h1>
        </div>
        <span class="text-sm text-slate-500">Panel privado</span>
      </header>

      <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <LoginHero />
        <LoginForm />
      </div>
    </section>
  </main>
</template>
