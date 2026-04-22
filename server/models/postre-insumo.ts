import mongoose, { Schema } from 'mongoose'

export type PostreInsumoDocument = mongoose.Document & {
  profileId: mongoose.Types.ObjectId
  name: string
  unit: string
  cost: number
}

const PostreInsumoSchema = new Schema<PostreInsumoDocument>({
  profileId: { type: Schema.Types.ObjectId, required: true, index: true },
  name: { type: String, required: true },
  unit: { type: String, required: true },
  cost: { type: Number, required: true }
}, { timestamps: true })

type ModelType = mongoose.Model<PostreInsumoDocument>
export const PostreInsumoModel = (mongoose.models.PostreInsumo as ModelType) || mongoose.model<PostreInsumoDocument>('PostreInsumo', PostreInsumoSchema)
