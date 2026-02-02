export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server && (to.path === '/login' || to.path === '/profiles')) {
    return
  }

  const authUser = useAuthUser()

  if (!authUser.value) {
    await refreshAuthUser()
  }

  if (to.path === '/login') {
    if (authUser.value) {
      return navigateTo(authUser.value.activeProfileId ? '/' : '/profiles')
    }
    return
  }

  if (!authUser.value) {
    return navigateTo('/login')
  }

  if (to.path !== '/profiles' && !authUser.value.activeProfileId) {
    return navigateTo('/profiles')
  }
})
