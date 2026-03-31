import type { Types } from 'mongoose'
import type { ProfileDocument } from '../models/user'
import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
  normalizeHiddenCategories,
  normalizeDefaultVisibility,
  normalizeCategories
} from './profile-categories'
import { listProfileCategoriesMap } from './profile-category-store'
import { DEFAULT_OPTIONAL_MODULES, normalizeModules } from './modules'
import { DEFAULT_PROFILE_ICON, normalizeProfileIcon } from './profile-icons'
import { normalizeThemeColor } from './theme'

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
    const hiddenIncomeCustoms = normalizeHiddenCategories(profile.hiddenIncomeCustoms)
    const hiddenExpenseCustoms = normalizeHiddenCategories(profile.hiddenExpenseCustoms)
    const modules = Array.isArray(profile.modules)
      ? normalizeModules(profile.modules)
      : DEFAULT_OPTIONAL_MODULES
    const avatarIcon = profile.avatarIcon
      ? normalizeProfileIcon(profile.avatarIcon)
      : DEFAULT_PROFILE_ICON
    const themeColor = normalizeThemeColor(profile.themeColor)

    const hiddenIncomeSet = new Set(hiddenIncomeDefaults.map(value => value.toLocaleLowerCase()))
    const hiddenExpenseSet = new Set(hiddenExpenseDefaults.map(value => value.toLocaleLowerCase()))
    const hiddenIncomeCustomSet = new Set(hiddenIncomeCustoms.map(value => value.toLocaleLowerCase()))
    const hiddenExpenseCustomSet = new Set(hiddenExpenseCustoms.map(value => value.toLocaleLowerCase()))

    const visibleIncomeDefaults = DEFAULT_INCOME_CATEGORIES.filter(
      category => !hiddenIncomeSet.has(category.toLocaleLowerCase())
    )
    const visibleExpenseDefaults = DEFAULT_EXPENSE_CATEGORIES.filter(
      category => !hiddenExpenseSet.has(category.toLocaleLowerCase())
    )

    const movementIncomeCategories = stored.incomeCategories.filter(
      category => !hiddenIncomeCustomSet.has(category.toLocaleLowerCase())
    )
    const movementExpenseCategories = stored.expenseCategories.filter(
      category => !hiddenExpenseCustomSet.has(category.toLocaleLowerCase())
    )

    return {
      _id: profileId,
      name: profile.name,
      avatarColor: profile.avatarColor,
      themeColor,
      avatarIcon,
      incomeCategories: normalizeCategories(movementIncomeCategories, visibleIncomeDefaults),
      expenseCategories: normalizeCategories(movementExpenseCategories, visibleExpenseDefaults),
      defaultIncomeCategories: [...DEFAULT_INCOME_CATEGORIES],
      defaultExpenseCategories: [...DEFAULT_EXPENSE_CATEGORIES],
      hiddenIncomeDefaults,
      hiddenExpenseDefaults,
      hiddenIncomeCustoms,
      hiddenExpenseCustoms,
      modules
    }
  })
}
