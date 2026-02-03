export default defineNuxtRouteMiddleware(async (to) => {
  const authUser = useAuthUser()

  if (!authUser.value) {
    await refreshAuthUser()
  }

  if (to.matched.length === 0) {
    return authUser.value ? navigateTo('/') : navigateTo('/login')
  }

  if (to.path === '/login') {
    if (authUser.value) {
      return navigateTo('/')
    }
    return
  }

  if (!authUser.value) {
    return navigateTo('/login')
  }
})
