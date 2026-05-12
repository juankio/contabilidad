export type ApiError = {
  data?: {
    statusMessage?: string
    message?: string
    error?: string
  }
  message: string
}

export const getApiErrorMsg = (error: unknown, fallback = 'Ocurrió un error inesperado') => {
  const err = error as ApiError
  return err?.data?.error || err?.data?.statusMessage || err?.data?.message || err?.message || fallback
}

/**
 * Cliente API centralizado para el frontend.
 * Estandariza las peticiones y evita la repetición de configuración global.
 */
export const $api = async <T = any>(request: string, opts?: any) => {
  const response = await $fetch<T>(request, {
    ...opts,
    headers: {
      ...opts?.headers
      // Aquí puedes inyectar headers globales si en un futuro usas Bearer tokens
    }
  })
  return response
}
