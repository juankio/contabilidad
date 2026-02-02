export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server && to.path === '/login') {
    return
  }

  const authUser = useAuthUser()

  if (!authUser.value) {
    await refreshAuthUser()
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
