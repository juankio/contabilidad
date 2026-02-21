import { defineEventHandler, createError } from 'h3'
import { connectMongoose } from '../../utils/mongoose'
import { requireUser } from '../../utils/auth'
import { UserModel } from '../../models/user'
import { GastoModel } from '../../models/gasto'
import { IngresoModel } from '../../models/ingreso'
import { serializeProfilesFromCategoryStore } from '../../utils/serialize'
import { removeProfileCategories } from '../../utils/profile-category-store'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const user = await requireUser(event)
  const profileId = event.context.params?.id
  if (!profileId) {
    throw createError({ statusCode: 400, statusMessage: 'Profile id missing' })
  }

  const profiles = user.profiles ?? []
  const targetExists = profiles.some(profile => profile._id?.toString() === profileId)
  if (!targetExists) {
    throw createError({ statusCode: 404, statusMessage: 'Profile not found' })
  }

  if (profiles.length <= 1) {
    throw createError({
      statusCode: 400,
      statusMessage: 'At least one profile is required'
    })
  }

  const remainingProfiles = profiles.filter(profile => profile._id?.toString() !== profileId)
  const isDeletingActive = user.activeProfileId?.toString() === profileId
  const nextActiveProfileId = isDeletingActive
    ? (remainingProfiles[0]?._id?.toString() ?? null)
    : (user.activeProfileId?.toString() ?? remainingProfiles[0]?._id?.toString() ?? null)

  const updated = await UserModel.findByIdAndUpdate(
    user._id,
    {
      $pull: { profiles: { _id: profileId } },
      $set: { activeProfileId: nextActiveProfileId }
    },
    { new: true }
  ).lean()

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Profile not found' })
  }

  await Promise.all([
    removeProfileCategories(user._id, profileId),
    GastoModel.deleteMany({ profileId }),
    IngresoModel.deleteMany({ profileId })
  ])

  return {
    profiles: await serializeProfilesFromCategoryStore(user._id, updated.profiles ?? []),
    activeProfileId: updated.activeProfileId?.toString() ?? null
  }
})
