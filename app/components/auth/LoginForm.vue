<script setup lang="ts">
import AuthModeSwitch from './AuthModeSwitch.vue'
import { useLoginForm } from '../../composables/auth/useLoginForm'

const {
  mode,
  email,
  password,
  profileName,
  loading,
  googleLoading,
  errorMessage,
  showPassword,
  googleButtonRef,
  canUseGoogle,
  submit
} = useLoginForm()
</script>

<template>
  <UCard class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <template #header>
      <AuthModeSwitch
        :mode="mode"
        @update:mode="mode = $event"
      />
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

      <div
        v-if="mode === 'register'"
        class="grid gap-2 text-sm text-slate-600"
      >
        <label for="profileName">Nombre del perfil</label>
        <UInput
          id="profileName"
          v-model="profileName"
          type="text"
          autocomplete="nickname"
          :required="mode === 'register'"
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

      <div
        v-if="mode === 'login'"
        class="grid gap-3"
      >
        <div class="relative text-center text-xs text-slate-400">
          <span class="relative z-10 bg-white px-2">o continuar con</span>
          <span class="absolute inset-x-0 top-1/2 block border-t border-slate-200" />
        </div>

        <div
          v-if="canUseGoogle"
          ref="googleButtonRef"
          class="google-button-wrap"
          :class="{ 'opacity-60 pointer-events-none': googleLoading }"
        />

        <p
          v-else
          class="text-xs text-slate-500"
        >
          Google login no esta configurado (falta GOOGLE_CLIENT_ID).
        </p>
      </div>

      <p class="text-xs text-slate-500">
        Al continuar aceptas que este es un acceso privado.
      </p>
    </form>
  </UCard>
</template>

<style scoped>
.google-button-wrap {
  min-height: 44px;
}
</style>
