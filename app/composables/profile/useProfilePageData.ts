import { useProfile } from '../useProfile'
import type { Ref } from 'vue'

export type CategoryType = 'income' | 'expense'

const normalizeCategoryList = (value: string[] | undefined) =>
  [...new Set((value ?? [])
    .map(item => item.trim().toLocaleLowerCase())
    .filter(Boolean))]
    .sort()
const hasSameItems = (left: string[] | undefined, right: string[] | undefined) => {
  const leftNormalized = normalizeCategoryList(left)
  const rightNormalized = normalizeCategoryList(right)
  return leftNormalized.length === rightNormalized.length
    && leftNormalized.every((item, index) => item === rightNormalized[index])
}

export function useProfilePageData() {
  const profile = useProfile()
  const nameInput = ref('')
  const hiddenIncomeDefaultsInput = ref<string[]>([])
  const hiddenExpenseDefaultsInput = ref<string[]>([])
  const hiddenIncomeCustomsInput = ref<string[]>([])
  const hiddenExpenseCustomsInput = ref<string[]>([])

  const syncList = (source: Ref<string[]>, target: Ref<string[]>) =>
    watch(source, value => (target.value = [...(value ?? [])]), { immediate: true })
  watch(profile.activeProfileName, (value) => {
    nameInput.value = value ?? ''
  }, { immediate: true })
  syncList(profile.activeHiddenIncomeDefaults, hiddenIncomeDefaultsInput)
  syncList(profile.activeHiddenExpenseDefaults, hiddenExpenseDefaultsInput)
  syncList(profile.activeHiddenIncomeCustoms, hiddenIncomeCustomsInput)
  syncList(profile.activeHiddenExpenseCustoms, hiddenExpenseCustomsInput)

  const normalizedNameInput = computed(() => nameInput.value.trim())
  const hasNameChanged = computed(() =>
    normalizedNameInput.value !== (profile.activeProfileName.value ?? '').trim()
  )
  const hasHiddenIncomeChanged = computed(() =>
    !hasSameItems(hiddenIncomeDefaultsInput.value, profile.activeHiddenIncomeDefaults.value)
  )
  const hasHiddenExpenseChanged = computed(() =>
    !hasSameItems(hiddenExpenseDefaultsInput.value, profile.activeHiddenExpenseDefaults.value)
  )
  const hasHiddenIncomeCustomsChanged = computed(() =>
    !hasSameItems(hiddenIncomeCustomsInput.value, profile.activeHiddenIncomeCustoms.value)
  )
  const hasHiddenExpenseCustomsChanged = computed(() =>
    !hasSameItems(hiddenExpenseCustomsInput.value, profile.activeHiddenExpenseCustoms.value)
  )

  const hasUnsavedChanges = computed(() => hasNameChanged.value
    || hasHiddenIncomeChanged.value
    || hasHiddenExpenseChanged.value
    || hasHiddenIncomeCustomsChanged.value
    || hasHiddenExpenseCustomsChanged.value)
  const canSaveProfile = computed(() =>
    Boolean(profile.activeProfileId.value)
    && normalizedNameInput.value.length >= 2
    && normalizedNameInput.value.length <= 32
    && hasUnsavedChanges.value
  )

  const save = async () => {
    if (!canSaveProfile.value) return false
    const ok = await profile.updateProfileSettings({
      name: normalizedNameInput.value,
      hiddenIncomeDefaults: hiddenIncomeDefaultsInput.value,
      hiddenExpenseDefaults: hiddenExpenseDefaultsInput.value,
      hiddenIncomeCustoms: hiddenIncomeCustomsInput.value,
      hiddenExpenseCustoms: hiddenExpenseCustomsInput.value
    })
    if (ok) {
      await navigateTo('/')
    }
  }

  const deleteCustomCategory = async (type: CategoryType, category: string) =>
    profile.removeProfileCategory(type, category)

  return {
    ...profile,
    nameInput,
    hiddenIncomeDefaultsInput,
    hiddenExpenseDefaultsInput,
    hiddenIncomeCustomsInput,
    hiddenExpenseCustomsInput,
    hasUnsavedChanges,
    canSaveProfile,
    save,
    deleteCustomCategory
  }
}
