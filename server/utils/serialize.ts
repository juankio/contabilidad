import type { Types } from 'mongoose'
import type { ProfileDocument } from '../models/user'
import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
  normalizeDefaultVisibility,
  normalizeCategories
} from './profile-categories'
import { listProfileCategoriesMap } from './profile-category-store'

export async function serializeProfilesFromCategoryStore(
  userId: string | Types.ObjectId,
  profiles: ProfileDocument[] = []
) {
  const profileIds = profiles.map(profile => profile._id)
  if (profileIds.length === 0) {
    return []
  }

  const categoriesByProfile = await listProfileCategoriesMap(userId, profileIds)

  return profiles.map((profile) => {
    const profileId = profile._id.toString()
    const stored = categoriesByProfile[profileId] ?? {
      incomeCategories: [],
      expenseCategories: []
    }

    const hiddenIncomeDefaults = normalizeDefaultVisibility(
      profile.hiddenIncomeDefaults,
      DEFAULT_INCOME_CATEGORIES
    )
    const hiddenExpenseDefaults = normalizeDefaultVisibility(
      profile.hiddenExpenseDefaults,
      DEFAULT_EXPENSE_CATEGORIES
    )

    const hiddenIncomeSet = new Set(hiddenIncomeDefaults.map(value => value.toLocaleLowerCase()))
    const hiddenExpenseSet = new Set(hiddenExpenseDefaults.map(value => value.toLocaleLowerCase()))

    const visibleIncomeDefaults = DEFAULT_INCOME_CATEGORIES.filter(
      category => !hiddenIncomeSet.has(category.toLocaleLowerCase())
    )
    const visibleExpenseDefaults = DEFAULT_EXPENSE_CATEGORIES.filter(
      category => !hiddenExpenseSet.has(category.toLocaleLowerCase())
    )

    const movementIncomeCategories = stored.incomeCategories.filter(
      category => !hiddenIncomeSet.has(category.toLocaleLowerCase())
    )
    const movementExpenseCategories = stored.expenseCategories.filter(
      category => !hiddenExpenseSet.has(category.toLocaleLowerCase())
    )

    return {
      _id: profileId,
      name: profile.name,
      avatarColor: profile.avatarColor,
      incomeCategories: normalizeCategories(movementIncomeCategories, visibleIncomeDefaults),
      expenseCategories: normalizeCategories(movementExpenseCategories, visibleExpenseDefaults),
      defaultIncomeCategories: [...DEFAULT_INCOME_CATEGORIES],
      defaultExpenseCategories: [...DEFAULT_EXPENSE_CATEGORIES],
      hiddenIncomeDefaults,
      hiddenExpenseDefaults
    }
  })
}
