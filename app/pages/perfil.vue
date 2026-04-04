<script setup lang="ts">
import ProfileEditorPanel from '../components/profiles/ProfileEditorPanel.vue'
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-6xl overflow-x-clip px-4 pb-10 pt-6">
      <div class="grid min-w-0 gap-6 lg:grid-cols-12">
        <header class="anim-up rounded-3xl bg-white p-5 shadow-sm lg:col-span-12">
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm"
              style="background: var(--brand-600)"
            >
              <UIcon
                name="lucide:user-round"
                class="h-5 w-5 text-white"
              />
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
                Configuración
              </p>
              <h1 class="text-lg font-semibold text-slate-900">
                Editar perfil
              </h1>
            </div>
          </div>
          <p class="mt-3 text-sm text-slate-500">
            Administra perfiles, categorías y configuraciones de visibilidad.
          </p>
        </header>

        <ProfileEditorPanel class="anim-up-1 min-w-0 lg:col-span-12" />
      </div>
    </section>
  </main>
</template>
