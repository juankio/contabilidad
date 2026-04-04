<script setup lang="ts">
import { reactive, useAttrs } from 'vue'
import { useProfilePage } from '../../composables/profile/useProfilePage'
import ProfileCategoriesSection from './ProfileCategoriesSection.vue'
import ProfileCreateModal from './ProfileCreateModal.vue'
import ProfileDeleteModal from './ProfileDeleteModal.vue'
import ProfileFooterSection from './ProfileFooterSection.vue'
import ProfileHeaderSection from './ProfileHeaderSection.vue'
import ProfileIdentitySection from './ProfileIdentitySection.vue'
import ProfileModulesSection from './ProfileModulesSection.vue'
import ProfileRenameModal from './ProfileRenameModal.vue'

defineOptions({ inheritAttrs: false })

const page = reactive(useProfilePage())
const attrs = useAttrs()
</script>

<template>
  <div
    v-bind="attrs"
    class="space-y-4"
  >
    <div class="grid gap-4 lg:grid-cols-12">
      <ProfileHeaderSection
        class="lg:col-span-7"
        :profiles="page.profiles"
        :active-profile-id="page.activeProfileId"
        :loading="page.loading"
        :can-delete-profiles="page.canDeleteProfiles"
        @activate="page.activateProfile"
        @create="page.openCreateProfileModal"
        @delete-active="page.openDeleteProfileModal"
      />

      <ProfileIdentitySection
        class="lg:col-span-5"
        :profile-name="page.nameInput"
        :loading="page.loading"
        @rename="page.openRenameProfileModal"
      />
    </div>

    <ProfileModulesSection
      :selected-modules="page.modulesInput"
      :loading="page.loading"
      @update:selected-modules="page.modulesInput = $event"
    />

    <div class="rounded-2xl border border-slate-200 bg-white p-4">
      <ProfileCategoriesSection
        :loading="page.loading"
        :default-income-categories="page.defaultIncomeCategories"
        :default-expense-categories="page.defaultExpenseCategories"
        :hidden-income-set="page.hiddenIncomeSet"
        :hidden-expense-set="page.hiddenExpenseSet"
        :hidden-income-custom-set="page.hiddenIncomeCustomSet"
        :hidden-expense-custom-set="page.hiddenExpenseCustomSet"
        :custom-income-categories="page.customIncomeCategories"
        :custom-expense-categories="page.customExpenseCategories"
        @toggle="page.toggleDefaultVisibility"
        @toggle-custom="page.toggleCustomVisibility"
        @remove="page.deleteCustomCategory"
      />

      <ProfileFooterSection
        :error-message="page.errorMessage"
        :loading="page.loading"
        :can-save="page.canSaveProfile"
        @cancel="navigateTo('/')"
        @save="page.save"
      />
    </div>
  </div>

  <ProfileCreateModal
    :open="page.showCreateProfileModal"
    :loading="page.loading"
    :name="page.newProfileName"
    :icon="page.newProfileIcon"
    @update:name="page.newProfileName = $event"
    @update:icon="page.newProfileIcon = $event"
    @close="page.closeCreateProfileModal"
    @confirm="page.confirmCreateProfile"
  />

  <ProfileRenameModal
    :open="page.showRenameProfileModal"
    :loading="page.loading"
    :name="page.renameProfileInput"
    :icon="page.renameProfileIcon"
    @update:name="page.renameProfileInput = $event"
    @update:icon="page.renameProfileIcon = $event"
    @close="page.closeRenameProfileModal"
    @confirm="page.confirmRenameProfileDraft"
  />

  <ProfileDeleteModal
    :open="page.showDeleteProfileModal"
    :loading="page.loading"
    :can-delete-profiles="page.canDeleteProfiles"
    :profile-name="page.profileToDelete?.name || ''"
    :confirm-input="page.deleteProfileNameInput"
    @update:confirm-input="page.deleteProfileNameInput = $event"
    @close="page.closeDeleteProfileModal"
    @confirm="page.confirmDeleteProfile"
  />
</template>
