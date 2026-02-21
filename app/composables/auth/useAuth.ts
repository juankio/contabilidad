type AuthProfile = {
  _id: string
  name: string
  avatarColor: string
  incomeCategories: string[]
  expenseCategories: string[]
  defaultIncomeCategories: string[]
  defaultExpenseCategories: string[]
  hiddenIncomeDefaults: string[]
  hiddenExpenseDefaults: string[]
  hiddenIncomeCustoms: string[]
  hiddenExpenseCustoms: string[]
}

export type AuthUser = {
  id: string
  email: string
  profiles: AuthProfile[]
  activeProfileId?: string | null
}

export function useAuthUser() {
  return useState<AuthUser | null>('auth:user', () => null)
}

export async function refreshAuthUser() {
  const authUser = useAuthUser()
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
  const data = await $fetch<{ user: AuthUser | null }>('/api/auth/me', { headers })
  authUser.value = data?.user ?? null
  return authUser.value
}
