import type { OptionalModuleKey } from '../utils/modules'
import { useProfileState } from '../composables/profile/useProfileState'

export default defineNuxtRouteMiddleware((to) => {
  const required = to.meta.requiresModule as OptionalModuleKey | undefined
  if (!required) {
    return
  }

  const { activeModules } = useProfileState()
  if (!activeModules.value.includes(required)) {
    return navigateTo('/')
  }
})
