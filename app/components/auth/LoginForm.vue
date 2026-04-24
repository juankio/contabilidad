<script setup lang="ts">
import AuthModeSwitch from './AuthModeSwitch.vue'
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
  submit
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
      <h2 class="text-center text-2xl font-bold tracking-tight text-slate-900 mb-6">
        {{ mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta' }}
      </h2>
      <AuthModeSwitch
        :mode="mode"
        @update:mode="mode = $event"
      />
    </template>

    <form
      class="grid gap-4 mt-6"
      @submit.prevent="submit"
    >
      <div class="grid gap-1.5 text-sm">
        <label for="email" class="font-semibold text-slate-700">Correo Electrónico</label>
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
              aria-hidden="true"
            />
          </template>
        </UInput>
      </div>

      <div
        v-if="mode === 'register'"
        class="grid gap-1.5 text-sm anim-fade"
      >
        <label for="profileName" class="font-semibold text-slate-700">Nombre del espacio de trabajo</label>
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
              aria-hidden="true"
            />
          </template>
        </UInput>
      </div>

      <div
        v-if="mode === 'register'"
        class="grid gap-2 text-sm anim-fade-1"
      >
        <p class="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
          Módulos opcionales
        </p>
        <div class="grid grid-cols-2 gap-2">
          <label
            v-for="module in moduleOptions"
            :key="module.key"
            class="group flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3 transition-all hover:border-[var(--brand-300)] hover:bg-[var(--brand-50)]"
          >
            <input
              class="mt-0.5 h-4 w-4 rounded border-slate-300 text-[var(--brand-500)] focus:ring-[var(--brand-500)]"
              type="checkbox"
              :checked="selectedModules.includes(module.key)"
              @change="toggleModule(module.key)"
            >
            <span class="min-w-0">
              <span class="block text-sm font-bold text-slate-800 group-hover:text-[var(--brand-700)] leading-tight">
                {{ module.label }}
              </span>
            </span>
          </label>
        </div>
      </div>

      <div class="grid gap-1.5 text-sm">
        <label for="password" class="font-semibold text-slate-700">Contraseña</label>
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
              aria-hidden="true"
            />
          </template>
          <template #trailing>
            <UButton
              variant="ghost"
              color="neutral"
              size="sm"
              type="button"
              class="text-slate-400 hover:text-slate-600"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              @click="showPassword = !showPassword"
            >
              <UIcon
                :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
                class="h-5 w-5"
                aria-hidden="true"
              />
            </UButton>
          </template>
        </UInput>
      </div>

      <p
        v-if="errorMessage"
        class="text-sm font-medium text-rose-500 anim-fade"
      >
        {{ errorMessage }}
      </p>

      <UButton
        type="submit"
        color="primary"
        size="lg"
        block
        class="mt-2 rounded-xl font-bold shadow-md shadow-brand-500/20 text-base"
        :loading="loading"
      >
        {{ mode === 'register' ? 'Crear cuenta' : 'Entrar al panel' }}
      </UButton>

      <div
        v-if="mode === 'login'"
        class="grid gap-4 mt-4 anim-fade-2"
      >
        <div class="relative text-center text-xs font-semibold text-slate-400 uppercase tracking-widest">
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

      <p class="text-center text-xs font-medium text-slate-500 mt-4">
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
