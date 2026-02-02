export default defineNuxtRouteMiddleware(async (to) => {
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
