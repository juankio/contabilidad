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
      <!-- STEP 1: Datos básicos -->
      <template v-if="mode === 'login' || registerStep === 1">
        <div class="grid gap-1.5 text-sm anim-fade">
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
          class="grid gap-1.5 text-sm anim-fade-1"
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

        <div class="grid gap-1.5 text-sm anim-fade-2">
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
      </template>

      <!-- STEP 2: Color y Módulos -->
      <template v-if="mode === 'register' && registerStep === 2">
        <div class="grid gap-2 text-sm anim-fade">
          <p class="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-1">
            Color de tu espacio
          </p>
          <div class="flex flex-wrap gap-2.5">
            <button
              v-for="color in ['sky', 'blue', 'indigo', 'violet', 'fuchsia', 'rose', 'emerald', 'teal', 'amber']"
              :key="color"
              type="button"
              class="relative h-10 w-10 rounded-full transition-all duration-200 border-2"
              :class="themeColor === color ? 'border-slate-800 scale-110 shadow-md ring-2 ring-white ring-inset' : 'border-transparent hover:scale-110'"
              :style="{ backgroundColor: getColorHex(color) }"
              @click="themeColor = color"
            >
              <UIcon
                v-if="themeColor === color"
                name="lucide:check"
                class="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-md"
              />
            </button>
          </div>
        </div>

        <div class="grid gap-2 text-sm anim-fade-1 mt-2">
          <p class="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-1">
            Módulos opcionales
          </p>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="module in moduleOptions"
              :key="module.key"
              type="button"
              class="group relative flex cursor-pointer flex-col items-start gap-2 rounded-2xl border-2 p-3 text-left transition-all duration-200 active:scale-[0.98]"
              :class="selectedModules.includes(module.key) 
                ? 'border-slate-800 bg-slate-50 shadow-sm' 
                : 'border-slate-200/80 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'"
              @click="toggleModule(module.key)"
            >
              <div class="flex w-full items-center justify-between">
                <div 
                  class="flex h-8 w-8 items-center justify-center rounded-[0.8rem] transition-colors"
                  :class="selectedModules.includes(module.key) 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'bg-white text-slate-400 ring-1 ring-slate-200'"
                >
                  <UIcon 
                    :name="module.key === 'gastos' ? 'lucide:wallet' : 
                           module.key === 'postres' || module.key === 'catalogo-postres' ? 'lucide:cake' : 
                           module.key === 'granja-cerdos' ? 'lucide:paw-print' : 
                           module.key === 'prestamos' ? 'lucide:handshake' : 
                           module.key === 'trabajadores' ? 'lucide:users' : 
                           module.key === 'planeador' ? 'lucide:shopping-bag' : 'lucide:puzzle'" 
                    class="h-4 w-4" 
                  />
                </div>
                <div 
                  class="flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all"
                  :class="selectedModules.includes(module.key)
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-slate-300 bg-white'"
                >
                  <UIcon v-if="selectedModules.includes(module.key)" name="lucide:check" class="h-3 w-3" />
                </div>
              </div>
              <span 
                class="mt-1 block text-sm font-bold transition-colors"
                :class="selectedModules.includes(module.key) ? 'text-slate-900' : 'text-slate-700'"
              >
                {{ module.label }}
              </span>
            </button>
          </div>
        </div>
      </template>

      <p
        v-if="errorMessage"
        class="text-sm font-medium text-rose-500 anim-fade mt-1"
      >
        {{ errorMessage }}
      </p>

      <div class="flex gap-3 mt-2">
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
          class="flex-1 rounded-xl font-bold shadow-md shadow-brand-500/20 text-base"
          :loading="loading"
        >
          {{ mode === 'register' ? (registerStep === 1 ? 'Siguiente' : 'Crear cuenta') : 'Entrar al panel' }}
        </UButton>
      </div>

      <div
        v-if="mode === 'login' || registerStep === 1"
        class="grid gap-4 mt-2 anim-fade-2"
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

<script lang="ts">
// Función auxiliar para tener colores reales en los botones y no depender solo de la hoja de estilos global
function getColorHex(color: string) {
  const map: Record<string, string> = {
    sky: '#0ea5e9',
    blue: '#3b82f6',
    indigo: '#6366f1',
    violet: '#8b5cf6',
    fuchsia: '#d946ef',
    rose: '#f43f5e',
    emerald: '#10b981',
    teal: '#14b8a6',
    amber: '#f59e0b'
  }
  return map[color] || map.violet
}
</script>

<style scoped>
.google-button-wrap {
  min-height: 44px;
}
</style>
