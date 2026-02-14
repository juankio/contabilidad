import mongoose from 'mongoose'
import { CategoryModel, type ProfileCategoryType } from '../models/category'
import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES
} from './profile-categories'

type ProfileCategoryMap = Record<string, { incomeCategories: string[], expenseCategories: string[] }>

const MAX_CATEGORY_LENGTH = 40

function toObjectId(value: string | mongoose.Types.ObjectId) {
  return typeof value === 'string' ? new mongoose.Types.ObjectId(value) : value
}

function normalizeCategoryName(value: unknown) {
  if (typeof value !== 'string') {
    return ''
  }
  return value.trim().slice(0, MAX_CATEGORY_LENGTH)
}

function toNameKey(value: string) {
  return value.toLocaleLowerCase()
}

function isDefaultCategory(type: ProfileCategoryType, name: string) {
  const defaults = type === 'income' ? DEFAULT_INCOME_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES
  const key = name.toLocaleLowerCase()
  return defaults.some(defaultCategory => defaultCategory.toLocaleLowerCase() === key)
}

export async function upsertProfileCategory(
  userIdInput: string | mongoose.Types.ObjectId,
  profileIdInput: string | mongoose.Types.ObjectId,
  type: ProfileCategoryType,
  categoryInput: unknown
) {
  const name = normalizeCategoryName(categoryInput)
  if (!name || isDefaultCategory(type, name)) {
    return
  }

  const userId = toObjectId(userIdInput)
  const profileId = toObjectId(profileIdInput)
  const nameKey = toNameKey(name)

  await CategoryModel.updateOne(
    { userId, profileId, type, nameKey },
    { $set: { name }, $setOnInsert: { userId, profileId, type, nameKey } },
    { upsert: true }
  )
}

export async function listProfileCategoriesMap(
  userIdInput: string | mongoose.Types.ObjectId,
  profileIdsInput: Array<string | mongoose.Types.ObjectId>
) {
  const userId = toObjectId(userIdInput)
  const profileIds = profileIdsInput.map(toObjectId)
  if (profileIds.length === 0) {
    return {} satisfies ProfileCategoryMap
  }

  const rows = await CategoryModel.find({
    userId,
    profileId: { $in: profileIds }
  })
    .sort({ createdAt: 1, _id: 1 })
    .lean()

  const map: ProfileCategoryMap = {}
  for (const profileId of profileIds) {
    map[profileId.toString()] = {
      incomeCategories: [],
      expenseCategories: []
    }
  }

  for (const row of rows) {
    const profileId = row.profileId.toString()
    const bucket = map[profileId]
    if (!bucket) {
      continue
    }

    const category = normalizeCategoryName(row.name)
    if (!category) {
      continue
    }

    const target = row.type === 'income' ? bucket.incomeCategories : bucket.expenseCategories
    const exists = target.some(item => item.toLocaleLowerCase() === category.toLocaleLowerCase())
    if (!exists) {
      target.push(category)
    }
  }

  return map
}

export async function removeProfileCategories(
  userIdInput: string | mongoose.Types.ObjectId,
  profileIdInput: string | mongoose.Types.ObjectId
) {
  const userId = toObjectId(userIdInput)
  const profileId = toObjectId(profileIdInput)
  await CategoryModel.deleteMany({ userId, profileId })
}

export async function removeProfileCategory(
  userIdInput: string | mongoose.Types.ObjectId,
  profileIdInput: string | mongoose.Types.ObjectId,
  type: ProfileCategoryType,
  categoryInput: unknown
) {
  const name = normalizeCategoryName(categoryInput)
  if (!name || isDefaultCategory(type, name)) {
    return
  }

  const userId = toObjectId(userIdInput)
  const profileId = toObjectId(profileIdInput)
  const nameKey = toNameKey(name)

  await CategoryModel.deleteOne({ userId, profileId, type, nameKey })
}
