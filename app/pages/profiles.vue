<script setup lang="ts">
import ProfilesHeader from '~/components/profiles/ProfilesHeader.vue'
import ProfilesGrid from '~/components/profiles/ProfilesGrid.vue'

const {
  profiles,
  activeProfileId,
  pending,
  newName,
  errorMessage,
  creating,
  selectProfile,
  createProfile,
  removeProfile,
  logout
} = await useProfiles()
</script>

<template>
  <main class="min-h-screen bg-white text-slate-900">
    <section class="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-12">
      <ProfilesHeader :on-logout="logout" />

      <ProfilesGrid
        :profiles="profiles"
        :active-profile-id="activeProfileId"
        :new-name="newName"
        :creating="creating"
        :error-message="errorMessage"
        :on-select="selectProfile"
        :on-remove="removeProfile"
        :on-create="createProfile"
        @update:new-name="newName = $event"
      />

      <p
        v-if="pending"
        class="text-sm text-slate-500"
      >
        Cargando perfiles...
      </p>
    </section>
  </main>
</template>
