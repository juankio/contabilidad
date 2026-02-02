<script setup lang="ts">
import ProfileCard from './ProfileCard.vue'
import ProfileCreateCard from './ProfileCreateCard.vue'

type Profile = {
  _id: string
  name: string
  avatarColor: string
}

defineProps<{
  profiles: Profile[]
  activeProfileId: string | null
  newName: string
  creating: boolean
  errorMessage: string
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  onCreate: () => void
}>()

const emit = defineEmits<{
  (e: 'update:newName', value: string): void
}>()
</script>

<template>
  <section class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <ProfileCard
      v-for="profile in profiles"
      :key="profile._id"
      :profile="profile"
      :is-active="profile._id === activeProfileId"
      :on-select="onSelect"
      :on-remove="onRemove"
    />

    <ProfileCreateCard
      :model-value="newName"
      :loading="creating"
      :error-message="errorMessage"
      :on-submit="onCreate"
      @update:model-value="emit('update:newName', $event)"
    />
  </section>
</template>
