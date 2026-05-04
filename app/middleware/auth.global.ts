export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.user) {
    await authStore.refreshAuthUser()
  }

  const publicRoutes = ['/login']
  const isPublicRoute = publicRoutes.includes(to.path)

  if (!authStore.user && !isPublicRoute) {
    return navigateTo('/login')
  }

  if (authStore.user && isPublicRoute) {
    return navigateTo('/')
  }
})
