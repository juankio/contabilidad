<script setup lang="ts">
import ProfileEditorPanel from '../components/profiles/ProfileEditorPanel.vue'
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-6xl overflow-x-clip px-4 pb-10 pt-6">
      <div class="grid min-w-0 gap-6 lg:grid-cols-12">
        <header class="rounded-3xl bg-white p-5 shadow-sm lg:col-span-12">
          <p class="text-xs uppercase tracking-[0.3em] text-slate-400">
            Perfil
          </p>
          <h1 class="text-2xl font-semibold text-slate-900">
            Editar perfil
          </h1>
          <p class="mt-2 text-sm text-slate-500">
            Administra perfiles, categorias y configuraciones de visibilidad.
          </p>
        </header>

        <ProfileEditorPanel class="min-w-0 lg:col-span-12" />
      </div>
    </section>
  </main>
</template>
