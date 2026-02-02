import type { ProfileDocument } from '../models/user'

export function serializeProfiles(profiles: ProfileDocument[] = []) {
  return profiles.map(profile => ({
    _id: profile._id.toString(),
    name: profile.name,
    avatarColor: profile.avatarColor
  }))
}
