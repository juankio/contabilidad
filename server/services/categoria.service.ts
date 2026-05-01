import mongoose from 'mongoose'
import { GastoModel } from '../models/gasto'
import { getCategoriesWithOtherModules } from '../utils/stats-aggregations'

export type CategoriaResumen = {
  category: string
  total: number
}

export async function getCategoriasService(profileId: string) {
  const profileObjectId = new mongoose.Types.ObjectId(profileId)

  const now = new Date()
  // 🦀 ZONA HORARIA ARREGLADA (usar siempre UTC para empatar con DB)
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))

  // Ahora sacamos TODAS las categorias, incluyendo cosas de otros modulos
  // (Préstamos, Nómina, etc.) porque getCategoriesWithOtherModules de Sanji ya hace eso
  const categorias = await getCategoriesWithOtherModules(profileObjectId, start, end)

  return categorias.map(categoria => ({
    category: categoria.category || 'Sin categoria',
    total: Number(categoria.total ?? 0)
  }))
}
