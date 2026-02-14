import mongoose, { Schema } from 'mongoose'

export const PROFILE_CATEGORY_TYPES = ['income', 'expense'] as const
export type ProfileCategoryType = (typeof PROFILE_CATEGORY_TYPES)[number]

export type CategoryDocument = mongoose.Document & {
  userId: mongoose.Types.ObjectId
  profileId: mongoose.Types.ObjectId
  type: ProfileCategoryType
  name: string
  nameKey: string
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<CategoryDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    profileId: { type: Schema.Types.ObjectId, required: true, index: true },
    type: { type: String, required: true, enum: PROFILE_CATEGORY_TYPES, index: true },
    name: { type: String, required: true, trim: true },
    nameKey: { type: String, required: true, trim: true }
  },
  { timestamps: true }
)

CategorySchema.index(
  { userId: 1, profileId: 1, type: 1, nameKey: 1 },
  { unique: true, name: 'uniq_profile_category' }
)

type CategoryModelType = mongoose.Model<CategoryDocument>

export const CategoryModel = (mongoose.models.Category as CategoryModelType)
  || mongoose.model<CategoryDocument>('Category', CategorySchema, 'categories')
