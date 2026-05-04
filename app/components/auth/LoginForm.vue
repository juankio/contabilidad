<script setup lang="ts">

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

const setGoogleRef = (el: HTMLElement | null) => {
  googleButtonRef.value = el
}
</script>

<template>
  <UCard class="rounded-[2rem] border border-slate-200/60 bg-white p-6 shadow-xl md:p-8">
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
        class="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-[1.5rem] bg-white/40 backdrop-blur-sm transition-all duration-300"
      >
        <div class="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-xl ring-1 ring-slate-200/50">
          <UIcon name="lucide:loader-circle" class="h-5 w-5 animate-spin text-[var(--brand-500)]" />
          <p class="text-sm font-bold text-slate-700">
            {{ googleLoading ? 'Conectando...' : 'Preparando tu espacio...' }}
          </p>
        </div>
      </div>
      <!-- STEP 1: Datos básicos -->
      <template v-if="mode === 'login' || registerStep === 1">
        <LoginFields
          v-model:email="email"
          v-model:profile-name="profileName"
          v-model:password="password"
          v-model:show-password="showPassword"
          :mode="mode"
          :register-step="registerStep"
        />
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

      <template v-if="mode === 'login' || registerStep === 1">
        <LoginSocial
          :can-use-google="canUseGoogle"
          :google-loading="googleLoading"
          @set-ref="setGoogleRef"
        />
      </template>

      <p class="mt-4 text-center text-xs font-medium text-slate-500">
        Al continuar aceptas que este es un entorno privado.
      </p>
    </form>
  </UCard>
</template>
