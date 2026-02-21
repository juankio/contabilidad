import mongoose, { Schema } from 'mongoose'

export type ProfileDocument = {
  _id: mongoose.Types.ObjectId
  name: string
  avatarColor: string
  hiddenIncomeDefaults: string[]
  hiddenExpenseDefaults: string[]
  hiddenIncomeCustoms: string[]
  hiddenExpenseCustoms: string[]
  createdAt: Date
}

export type UserDocument = mongoose.Document & {
  email: string
  passwordHash?: string | null
  profiles: ProfileDocument[]
  activeProfileId?: mongoose.Types.ObjectId | null
  createdAt: Date
  updatedAt: Date
}

const ProfileSchema = new Schema<ProfileDocument>(
  {
    name: { type: String, required: true, trim: true },
    avatarColor: { type: String, required: true, trim: true },
    hiddenIncomeDefaults: { type: [String], default: [] },
    hiddenExpenseDefaults: { type: [String], default: [] },
    hiddenIncomeCustoms: { type: [String], default: [] },
    hiddenExpenseCustoms: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
)

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, default: null },
    profiles: { type: [ProfileSchema], default: [] },
    activeProfileId: { type: Schema.Types.ObjectId, default: null }
  },
  { timestamps: true }
)

type UserModelType = mongoose.Model<UserDocument>

export const UserModel = (mongoose.models.User as UserModelType)
  || mongoose.model<UserDocument>('User', UserSchema, 'users')
