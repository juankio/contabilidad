<script setup lang="ts">
const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const profileName = ref('')
const loading = ref(false)
const googleLoading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)
const googleButtonRef = ref<HTMLElement | null>(null)
const config = useRuntimeConfig()
const googleClientId = config.public.googleClientId as string

type GoogleCredentialResponse = {
  credential: string
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string, callback: (response: GoogleCredentialResponse) => void }) => void
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void
        }
      }
    }
    __googleScriptPromise?: Promise<void>
  }
}

const canUseGoogle = computed(() => Boolean(googleClientId))

async function loadGoogleScript() {
  if (window.google?.accounts?.id) {
    return
  }

  if (!window.__googleScriptPromise) {
    window.__googleScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('No se pudo cargar Google Sign-In'))
      document.head.appendChild(script)
    })
  }

  await window.__googleScriptPromise
}

function renderGoogleButton() {
  if (!canUseGoogle.value || !googleButtonRef.value || !window.google?.accounts?.id) {
    return
  }

  window.google.accounts.id.initialize({
    client_id: googleClientId,
    callback: handleGoogleCredential
  })

  googleButtonRef.value.innerHTML = ''
  window.google.accounts.id.renderButton(googleButtonRef.value, {
    type: 'standard',
    theme: 'outline',
    text: 'signin_with',
    shape: 'pill',
    size: 'large',
    logo_alignment: 'left',
    width: Math.max(220, Math.floor(googleButtonRef.value.clientWidth))
  })
}

async function handleGoogleCredential(response: GoogleCredentialResponse) {
  if (!response.credential) {
    return
  }

  errorMessage.value = ''
  googleLoading.value = true
  try {
    await $fetch('/api/auth/google', {
      method: 'POST',
      body: { credential: response.credential }
    })
    await refreshAuthUser()
    await navigateTo('/')
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    errorMessage.value = (error as { data?: { statusMessage?: string } })?.data?.statusMessage
      || message
      || 'No se pudo iniciar con Google'
  } finally {
    googleLoading.value = false
  }
}

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
    await navigateTo('/')
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    errorMessage.value = (error as { data?: { statusMessage?: string } })?.data?.statusMessage
      || message
      || 'No se pudo iniciar sesion'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!canUseGoogle.value) {
    return
  }

  try {
    await loadGoogleScript()
    renderGoogleButton()
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    errorMessage.value = message || 'No se pudo inicializar Google'
  }
})

watch(mode, async (currentMode) => {
  if (currentMode !== 'login' || !canUseGoogle.value) {
    return
  }

  await nextTick()
  renderGoogleButton()
})
</script>

<template>
  <UCard class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
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
