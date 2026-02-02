import { defineEventHandler } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireActiveProfile } from '../../utils/auth'
import mongoose from 'mongoose'
import { GastoModel } from '../../models/gasto'

type CategoriaResumen = {
  category: string
  total: number
}

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const { profileId } = await requireActiveProfile(event)
  const profileObjectId = new mongoose.Types.ObjectId(profileId)

  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const categorias = await GastoModel.aggregate<CategoriaResumen>([
    { $match: { profileId: profileObjectId, date: { $gte: start, $lt: end } } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } },
    { $limit: 6 },
    { $project: { _id: 0, category: '$_id', total: 1 } }
  ])

  return categorias.map(categoria => ({
    category: categoria.category || 'Sin categoria',
    total: Number(categoria.total ?? 0)
  }))
})
