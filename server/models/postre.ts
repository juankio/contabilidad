import mongoose, { Schema } from 'mongoose'

export type PostreDocument = mongoose.Document & {
  profileId: mongoose.Types.ObjectId
  name: string
  price: number
  receta: {
    insumoId: mongoose.Types.ObjectId
    yields: number
  }[]
}

const PostreSchema = new Schema<PostreDocument>({
  profileId: { type: Schema.Types.ObjectId, required: true, index: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  receta: [{
    insumoId: { type: Schema.Types.ObjectId, ref: 'PostreInsumo', required: true },
    yields: { type: Number, required: true }
  }]
}, { timestamps: true })

type ModelType = mongoose.Model<PostreDocument>
export const PostreModel = (mongoose.models.Postre as ModelType) || mongoose.model<PostreDocument>('Postre', PostreSchema)
