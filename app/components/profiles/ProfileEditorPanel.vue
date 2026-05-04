<script setup lang="ts">

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

    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex items-center gap-3 text-slate-900 mb-6">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-50)] border border-[var(--brand-100)] shadow-sm">
          <UIcon
            name="lucide:tags"
            class="h-5 w-5 text-[var(--brand-600)]"
          />
        </div>
        <div>
          <p class="text-base font-bold tracking-tight">
            Categorías
          </p>
          <p class="text-xs text-slate-500">
            Ajusta las categorías visibles para este espacio.
          </p>
        </div>
      </div>

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
    :theme-color="page.newProfileTheme"
    @update:name="page.newProfileName = $event"
    @update:icon="page.newProfileIcon = $event"
    @update:theme-color="page.newProfileTheme = $event"
    @update:open="page.closeCreateProfileModal"
    @confirm="page.confirmCreateProfile"
  />

  <ProfileRenameModal
    :open="page.showRenameProfileModal"
    :loading="page.isSavingIdentity"
    :name="page.renameProfileInput"
    :icon="page.renameProfileIcon"
    :theme-color="page.renameProfileTheme"
    @update:name="page.renameProfileInput = $event"
    @update:icon="page.renameProfileIcon = $event"
    @update:theme-color="page.renameProfileTheme = $event"
    @update:open="page.closeRenameProfileModal"
    @confirm="page.confirmRenameProfileDraft"
  />

  <ProfileDeleteModal
    :open="page.showDeleteProfileModal"
    :loading="page.loading"
    :can-delete-profiles="page.canDeleteProfiles"
    :profile-name="page.profileToDelete?.name || ''"
    :confirm-input="page.deleteProfileNameInput"
    @update:confirm-input="page.deleteProfileNameInput = $event"
    @update:open="page.closeDeleteProfileModal"
    @confirm="page.confirmDeleteProfile"
  />
</template>
