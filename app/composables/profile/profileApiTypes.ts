export type ProfileRecord = {
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

export type ProfilesResponse = {
  profiles: ProfileRecord[]
  activeProfileId: string | null
}

export type ProfileRequestError = {
  data?: {
    statusMessage?: string
  }
}
