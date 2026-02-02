<script setup lang="ts">
const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const profileName = ref('')
const loading = ref(false)
const errorMessage = ref('')

const submit = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    if (mode.value === 'register') {
      const payload: { email: string, password: string, profileName?: string } = {
        email: email.value,
        password: password.value
      }
      if (profileName.value.trim()) {
        payload.profileName = profileName.value.trim()
      }
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: payload
      })
    } else {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email: email.value, password: password.value }
      })
    }
    await refreshAuthUser()
    await navigateTo('/profiles')
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    errorMessage.value = (error as { data?: { statusMessage?: string } })?.data?.statusMessage
      || message
      || 'No se pudo iniciar sesion'
  } finally {
    loading.value = false
  }
}
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
        <UCard class="rounded-3xl border border-slate-200 bg-slate-50">
          <template #header>
            <h2 class="text-3xl font-semibold">
              Control total en un solo lugar
            </h2>
          </template>
          <p class="mt-3 text-base text-slate-600">
            Registro por correo y contrasena, perfiles y acceso seguro para mantener tu
            contabilidad ordenada.
          </p>
          <ul class="mt-6 space-y-3 text-sm text-slate-500">
            <li>Perfiles multiples para separar actividades.</li>
            <li>Acceso privado por cuenta.</li>
            <li>Diseño simple y funcional.</li>
          </ul>
        </UCard>

        <UCard class="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <template #header>
            <div class="flex rounded-full bg-slate-100 p-1 text-sm">
              <button
                type="button"
                class="flex-1 rounded-full px-3 py-2 font-medium"
                :class="mode === 'login' ? 'bg-white shadow-sm' : 'text-slate-500'"
                @click="mode = 'login'"
              >
                Iniciar sesion
              </button>
              <button
                type="button"
                class="flex-1 rounded-full px-3 py-2 font-medium"
                :class="mode === 'register' ? 'bg-white shadow-sm' : 'text-slate-500'"
                @click="mode = 'register'"
              >
                Crear cuenta
              </button>
            </div>
          </template>

          <form
            class="grid gap-4"
            @submit.prevent="submit"
          >
            <div class="grid gap-2 text-sm text-slate-600">
              <label for="email">Correo</label>
              <UInput
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                size="lg"
              />
            </div>

            <div class="grid gap-2 text-sm text-slate-600">
              <label for="password">Contrasena</label>
              <UInput
                id="password"
                v-model="password"
                type="password"
                autocomplete="current-password"
                required
                size="lg"
              />
            </div>

            <div
              v-if="mode === 'register'"
              class="grid gap-2 text-sm text-slate-600"
            >
              <label for="profileName">Nombre de perfil</label>
              <UInput
                id="profileName"
                v-model="profileName"
                type="text"
                autocomplete="nickname"
                placeholder="Principal"
                size="lg"
              />
            </div>

            <p
              v-if="errorMessage"
              class="text-sm text-red-500"
            >
              {{ errorMessage }}
            </p>

            <UButton
              type="submit"
              color="neutral"
              size="lg"
              block
              :loading="loading"
            >
              {{ mode === 'register' ? 'Crear cuenta' : 'Entrar' }}
            </UButton>

            <p
              class="text-xs text-slate-500"
            >
              Al continuar aceptas que este es un acceso privado.
            </p>
          </form>
        </UCard>
      </div>
    </section>
  </main>
</template>
