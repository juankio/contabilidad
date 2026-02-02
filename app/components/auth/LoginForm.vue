<script setup lang="ts">
const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const profileName = ref('')
const loading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

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
        >
          <template #leading>
            <UIcon
              name="lucide:mail"
              class="h-4 w-4 text-slate-400"
              aria-hidden="true"
            />
          </template>
        </UInput>
      </div>

      <div class="grid gap-2 text-sm text-slate-600">
        <label for="password">Contraseña</label>
        <UInput
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          required
          size="lg"
        >
          <template #leading>
            <UIcon
              name="lucide:lock"
              class="h-4 w-4 text-slate-400"
              aria-hidden="true"
            />
          </template>
          <template #trailing>
            <UButton
              variant="ghost"
              color="neutral"
              size="xs"
              type="button"
              :aria-label="showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'"
              @click="showPassword = !showPassword"
            >
              <UIcon
                :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
                class="h-4 w-4"
                aria-hidden="true"
              />
            </UButton>
          </template>
        </UInput>
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
        >
          <template #leading>
            <UIcon
              name="lucide:user"
              class="h-4 w-4 text-slate-400"
              aria-hidden="true"
            />
          </template>
        </UInput>
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

      <p class="text-xs text-slate-500">
        Al continuar aceptas que este es un acceso privado.
      </p>
    </form>
  </UCard>
</template>
