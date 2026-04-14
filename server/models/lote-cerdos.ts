import mongoose, { Schema } from 'mongoose'

type MuerteCerdo = {
  fecha: Date
  cantidad: number
  causa: string
}

type PartoCerdo = {
  fecha: Date
  nacidosVivos: number
  nacidosMuertos: number
  observaciones: string
}

type ComidaHorario = {
  hora: string // e.g. "08:00"
  formula: string
  cantidadKilos: number
}

export type LoteCerdosDocument = mongoose.Document & {
  profileId: mongoose.Types.ObjectId
  nombreLoteMadre: string
  fechaLlegada: Date
  cantidadInicial: number
  cantidadActual: number
  estado: 'activo' | 'vendido'
  partos: PartoCerdo[]
  muertes: MuerteCerdo[]
  horariosComida: ComidaHorario[]
}

const MuerteCerdoSchema = new Schema<MuerteCerdo>({
  fecha: { type: Date, required: true },
  cantidad: { type: Number, required: true, min: 1 },
  causa: { type: String, required: true, trim: true }
}, { _id: true })

const PartoCerdoSchema = new Schema<PartoCerdo>({
  fecha: { type: Date, required: true },
  nacidosVivos: { type: Number, required: true, min: 0 },
  nacidosMuertos: { type: Number, required: true, min: 0 },
  observaciones: { type: String, default: '', trim: true }
}, { _id: true })

const ComidaHorarioSchema = new Schema<ComidaHorario>({
  hora: { type: String, required: true },
  formula: { type: String, required: true, trim: true },
  cantidadKilos: { type: Number, required: true, min: 0 }
}, { _id: true })

const LoteCerdosSchema = new Schema<LoteCerdosDocument>({
  profileId: { type: Schema.Types.ObjectId, required: true, index: true },
  nombreLoteMadre: { type: String, required: true, trim: true },
  fechaLlegada: { type: Date, required: true },
  cantidadInicial: { type: Number, required: true, min: 1 },
  cantidadActual: { type: Number, required: true, min: 0 },
  estado: { type: String, enum: ['activo', 'vendido'], default: 'activo' },
  partos: { type: [PartoCerdoSchema], default: [] },
  muertes: { type: [MuerteCerdoSchema], default: [] },
  horariosComida: { type: [ComidaHorarioSchema], default: [] }
}, { timestamps: true })

LoteCerdosSchema.index({ profileId: 1, estado: 1 })

type LoteCerdosModelType = mongoose.Model<LoteCerdosDocument>
export const LoteCerdosModel = (mongoose.models.LoteCerdos as LoteCerdosModelType) || mongoose.model<LoteCerdosDocument>('LoteCerdos', LoteCerdosSchema, 'lotes_cerdos')
