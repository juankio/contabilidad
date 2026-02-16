type AuthMode = 'login' | 'register'
import { refreshAuthUser } from './useAuth'

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

export function useLoginForm() {
  const mode = ref<AuthMode>('login')
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

  return {
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
  }
}
