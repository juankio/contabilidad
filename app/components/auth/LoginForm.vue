<script setup lang="ts">
import AuthModeSwitch from './AuthModeSwitch.vue'
import AuthColorPicker from './forms/AuthColorPicker.vue'
import AuthModuleSelector from './forms/AuthModuleSelector.vue'
import { useLoginForm } from '../../composables/auth/useLoginForm'

const {
  mode,
  email,
  password,
  profileName,
  selectedModules,
  moduleOptions,
  toggleModule,
  loading,
  googleLoading,
  errorMessage,
  showPassword,
  googleButtonRef,
  canUseGoogle,
  submit,
  registerStep,
  themeColor
} = useLoginForm()
</script>

<template>
  <UCard class="rounded-[2rem] border border-slate-200/60 bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">
    <template #header>
      <div class="mb-6 flex justify-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-[var(--brand-400)] to-[var(--brand-600)] shadow-lg shadow-brand-500/20">
          <UIcon
            name="lucide:shield-check"
            class="h-8 w-8 text-white"
          />
        </div>
      </div>
      <h2 class="mb-6 text-center text-2xl font-bold tracking-tight text-slate-900">
        {{ mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta' }}
      </h2>
      <AuthModeSwitch
        :mode="mode"
        @update:mode="mode = $event"
      />
    </template>

    <form
      class="mt-6 grid gap-4 relative"
      @submit.prevent="submit"
    >
      <!-- Loading Overlay -->
      <div
        v-if="loading || googleLoading"
        class="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-[1.5rem] bg-white/60 backdrop-blur-md transition-all duration-300"
      >
        <div class="relative flex h-16 w-16 items-center justify-center">
          <div class="absolute h-full w-full animate-ping rounded-full bg-[var(--brand-400)] opacity-20" />
          <div class="absolute h-12 w-12 animate-pulse rounded-full bg-[var(--brand-500)] opacity-40" />
          <UIcon name="lucide:loader-2" class="relative z-10 h-8 w-8 animate-spin text-[var(--brand-600)]" />
        </div>
        <p class="mt-4 text-sm font-bold text-slate-700 animate-pulse">
          {{ googleLoading ? 'Conectando con Google...' : 'Preparando tu espacio...' }}
        </p>
      </div>
      <!-- STEP 1: Datos básicos -->
      <template v-if="mode === 'login' || registerStep === 1">
        <div class="anim-fade grid gap-1.5 text-sm">
          <label
            for="email"
            class="font-semibold text-slate-700"
          >Correo Electrónico</label>
          <UInput
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="tu@correo.com"
            required
            size="lg"
            :ui="{ wrapper: 'shadow-sm rounded-xl' }"
          >
            <template #leading>
              <UIcon
                name="lucide:mail"
                class="h-5 w-5 text-slate-400"
              />
            </template>
          </UInput>
        </div>

        <div
          v-if="mode === 'register'"
          class="anim-fade-1 grid gap-1.5 text-sm"
        >
          <label
            for="profileName"
            class="font-semibold text-slate-700"
          >Nombre del espacio de trabajo</label>
          <UInput
            id="profileName"
            v-model="profileName"
            type="text"
            autocomplete="nickname"
            placeholder="Ej: Mi Negocio"
            :required="mode === 'register'"
            size="lg"
            :ui="{ wrapper: 'shadow-sm rounded-xl' }"
          >
            <template #leading>
              <UIcon
                name="lucide:briefcase"
                class="h-5 w-5 text-slate-400"
              />
            </template>
          </UInput>
        </div>

        <div class="anim-fade-2 grid gap-1.5 text-sm">
          <label
            for="password"
            class="font-semibold text-slate-700"
          >Contraseña</label>
          <UInput
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="••••••••"
            required
            size="lg"
            :ui="{ wrapper: 'shadow-sm rounded-xl' }"
          >
            <template #leading>
              <UIcon
                name="lucide:lock"
                class="h-5 w-5 text-slate-400"
              />
            </template>
            <template #trailing>
              <UButton
                variant="ghost"
                color="neutral"
                size="sm"
                type="button"
                class="text-slate-400 hover:text-slate-600"
                @click="showPassword = !showPassword"
              >
                <UIcon
                  :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
                  class="h-5 w-5"
                />
              </UButton>
            </template>
          </UInput>
        </div>
      </template>

      <!-- STEP 2: Color y Módulos -->
      <template v-if="mode === 'register' && registerStep === 2">
        <AuthColorPicker
          :theme-color="themeColor"
          @update:theme-color="themeColor = $event"
        />

        <AuthModuleSelector
          :selected-modules="selectedModules"
          :module-options="moduleOptions"
          @toggle-module="toggleModule"
        />
      </template>

      <p
        v-if="errorMessage"
        class="anim-fade mt-1 text-sm font-medium text-rose-500"
      >
        {{ errorMessage }}
      </p>

      <div class="mt-2 flex gap-3">
        <UButton
          v-if="mode === 'register' && registerStep === 2"
          type="button"
          color="neutral"
          variant="soft"
          size="lg"
          icon="lucide:arrow-left"
          class="rounded-xl px-4"
          @click="registerStep = 1"
        />
        <UButton
          type="submit"
          color="primary"
          size="lg"
          block
          class="flex-1 text-base font-bold shadow-md shadow-brand-500/20 rounded-xl"
          :loading="loading"
        >
          {{ mode === 'register' ? (registerStep === 1 ? 'Siguiente' : 'Crear cuenta') : 'Entrar al panel' }}
        </UButton>
      </div>

      <div
        v-if="mode === 'login' || registerStep === 1"
        class="anim-fade-2 mt-2 grid gap-4"
      >
        <div class="relative text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
          <span class="relative z-10 bg-white/80 px-4 backdrop-blur-sm">o continuar con</span>
          <span class="absolute inset-x-0 top-1/2 block border-t border-slate-200/80" />
        </div>

        <div
          v-if="canUseGoogle"
          ref="googleButtonRef"
          class="google-button-wrap flex justify-center"
          :class="{ 'opacity-60 pointer-events-none': googleLoading }"
        />
        <p
          v-else
          class="text-center text-xs font-medium text-slate-500"
        >
          Autenticación de Google no configurada.
        </p>
      </div>

      <p class="mt-4 text-center text-xs font-medium text-slate-500">
        Al continuar aceptas que este es un entorno privado.
      </p>
    </form>
  </UCard>
</template>

<style scoped>
.google-button-wrap {
  min-height: 44px;
}
</style>
