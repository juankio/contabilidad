import { refreshAuthUser } from './useAuth'
import { OPTIONAL_MODULE_KEYS, OPTIONAL_MODULES, type OptionalModuleKey } from '../../utils/modules'

type AuthMode = 'login' | 'register'

type GoogleCredentialResponse = {
  credential: string
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string, callback: (response: GoogleCredentialResponse) => void, auto_select?: boolean, cancel_on_tap_outside?: boolean }) => void
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void
        }
      }
    }
    __googleScriptPromise?: Promise<void>
  }
}

export function useLoginForm() {
  const mode = ref<AuthMode>('login')
  const registerStep = ref<1 | 2>(1)
  const email = ref('')
  const password = ref('')
  const profileName = ref('')
  const themeColor = ref('sky')
  const selectedModules = ref<OptionalModuleKey[]>([])
  const loading = ref(false)
  const googleLoading = ref(false)
  const errorMessage = ref('')
  const showPassword = ref(false)
  const googleCredential = ref('')
  const googleButtonRef = ref<HTMLElement | null>(null)
  const config = useRuntimeConfig()
  const googleClientId = config.public.googleClientId as string
  const canUseGoogle = computed(() => Boolean(googleClientId))
  const moduleOptions = computed(() => OPTIONAL_MODULES)

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
      const res = await $fetch<{ action?: string, email?: string, name?: string, credential?: string }>('/api/auth/google', {
        method: 'POST',
        body: { credential: response.credential }
      })

      if (res && res.action === 'requires_onboarding') {
        mode.value = 'register'
        registerStep.value = 2
        email.value = res.email || ''
        profileName.value = res.name || ''
        googleCredential.value = res.credential || ''
        return
      }

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
      callback: handleGoogleCredential,
      auto_select: false,
      cancel_on_tap_outside: false
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
    if (mode.value === 'register' && registerStep.value === 1) {
      registerStep.value = 2
      return
    }

    errorMessage.value = ''
    loading.value = true
    try {
      if (googleCredential.value) {
        // Completar registro con Google
        const payload: { credential: string, themeColor: string, profileName?: string, modules?: string[] } = {
          credential: googleCredential.value,
          themeColor: themeColor.value
        }
        if (profileName.value.trim()) {
          payload.profileName = profileName.value.trim()
        }
        if (selectedModules.value.length > 0) {
          payload.modules = selectedModules.value
        }
        await $fetch('/api/auth/google', {
          method: 'POST',
          body: payload
        })
      } else if (mode.value === 'register') {
        const payload: { email: string, password: string, profileName?: string, modules?: string[], themeColor?: string } = {
          email: email.value,
          password: password.value,
          themeColor: themeColor.value
        }
        if (profileName.value.trim()) {
          payload.profileName = profileName.value.trim()
        }
        if (selectedModules.value.length > 0) {
          payload.modules = selectedModules.value
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

  const toggleModule = (key: OptionalModuleKey) => {
    if (!OPTIONAL_MODULE_KEYS.includes(key)) {
      return
    }
    if (selectedModules.value.includes(key)) {
      selectedModules.value = selectedModules.value.filter(item => item !== key)
      return
    }
    selectedModules.value = [...selectedModules.value, key]
  }

  return {
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
  }
}
