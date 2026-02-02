import mongoose, { Schema } from 'mongoose'

export type ProfileDocument = {
  _id: mongoose.Types.ObjectId
  name: string
  avatarColor: string
  createdAt: Date
}

export type UserDocument = mongoose.Document & {
  email: string
  passwordHash: string
  profiles: ProfileDocument[]
  activeProfileId?: mongoose.Types.ObjectId | null
  createdAt: Date
  updatedAt: Date
}

const ProfileSchema = new Schema<ProfileDocument>(
  {
    name: { type: String, required: true, trim: true },
    avatarColor: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
)

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    profiles: { type: [ProfileSchema], default: [] },
    activeProfileId: { type: Schema.Types.ObjectId, default: null }
  },
  { timestamps: true }
)

export const UserModel = mongoose.models.User
  || mongoose.model<UserDocument>('User', UserSchema, 'users')
