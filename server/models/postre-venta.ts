import mongoose, { Schema } from 'mongoose'

export type PostreVentaDocument = mongoose.Document & {
  profileId: string
  postreId: mongoose.Types.ObjectId
  qty: number
  date: Date
}

const PostreVentaSchema = new Schema<PostreVentaDocument>({
  profileId: { type: String, required: true, index: true },
  postreId: { type: Schema.Types.ObjectId, ref: 'Postre', required: true },
  qty: { type: Number, required: true },
  date: { type: Date, required: true }
}, { timestamps: true })

type ModelType = mongoose.Model<PostreVentaDocument>
export const PostreVentaModel = (mongoose.models.PostreVenta as ModelType) || mongoose.model<PostreVentaDocument>('PostreVenta', PostreVentaSchema)
