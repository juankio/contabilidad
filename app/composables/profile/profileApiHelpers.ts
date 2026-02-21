import type { Ref } from 'vue'
import type { AuthUser } from '../auth/useAuth'
import type { ProfileRequestError, ProfilesResponse } from './profileApiTypes'

type ValidatedProfileName
  = { ok: true, value: string }
    | { ok: false, message: string }

export function syncAuthProfiles(authUser: Ref<AuthUser | null>, data: ProfilesResponse) {
  if (!authUser.value) {
    return
  }

  authUser.value = {
    ...authUser.value,
    profiles: data.profiles ?? [],
    activeProfileId: data.activeProfileId
  }
}

export function getProfileRequestError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : ''
  return (error as ProfileRequestError)?.data?.statusMessage || message || fallback
}

export function isProfileNameValid(value: string): ValidatedProfileName {
  const trimmed = value.trim()
  if (trimmed.length < 2) {
    return { ok: false, message: 'El nombre debe tener al menos 2 caracteres.' }
  }
  if (trimmed.length > 32) {
    return { ok: false, message: 'El nombre no puede superar 32 caracteres.' }
  }
  return { ok: true, value: trimmed }
}
