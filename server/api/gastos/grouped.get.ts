import type mongoose from 'mongoose'
import { defineEventHandler } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireUser } from '../../utils/auth'
import { GastoModel } from '../../models/gasto'

type GroupedGasto = {
  _id: string
  description: string
  category: string
  amount: number
  date: string
  receipt?: {
    url: string
    publicId: string
  } | null
}

type GroupedProfile = {
  profileId: string
  profileName: string
  avatarColor: string
  total: number
  gastos: GroupedGasto[]
}

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const user = await requireUser(event)
  const profiles = user.profiles ?? []
  if (profiles.length === 0) {
    return []
  }

  const profileIds = profiles
    .map(profile => profile._id)
    .filter((value): value is mongoose.Types.ObjectId => Boolean(value))

  const gastos = await GastoModel.find({ profileId: { $in: profileIds } })
    .sort({ date: -1 })
    .limit(400)
    .lean()

  const byProfile: Record<string, GroupedProfile> = {}
  for (const profile of profiles) {
    const key = profile._id.toString()
    byProfile[key] = {
      profileId: key,
      profileName: profile.name,
      avatarColor: profile.avatarColor,
      total: 0,
      gastos: []
    }
  }

  for (const gasto of gastos) {
    const key = gasto.profileId?.toString()
    if (!key || !byProfile[key]) {
      continue
    }

    const amount = Number(gasto.amount ?? 0)
    byProfile[key].total += amount
    byProfile[key].gastos.push({
      _id: gasto._id.toString(),
      description: gasto.description ?? '',
      category: gasto.category ?? '',
      amount,
      date: gasto.date instanceof Date ? gasto.date.toISOString() : new Date().toISOString(),
      receipt: gasto.receipt?.url && gasto.receipt?.publicId
        ? {
            url: gasto.receipt.url,
            publicId: gasto.receipt.publicId
          }
        : null
    })
  }

  return Object.values(byProfile).sort((a, b) => b.total - a.total)
})
