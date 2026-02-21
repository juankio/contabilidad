import type { ComputedRef, Ref } from 'vue'
import type { CategoryType } from './useProfilePageData'

type CategoryInputs = {
  activeIncomeCategories: ComputedRef<string[]>
  activeExpenseCategories: ComputedRef<string[]>
  activeDefaultIncomeCategories: ComputedRef<string[]>
  activeDefaultExpenseCategories: ComputedRef<string[]>
  activeHiddenIncomeCustoms: ComputedRef<string[]>
  activeHiddenExpenseCustoms: ComputedRef<string[]>
  hiddenIncomeDefaultsInput: Ref<string[]>
  hiddenExpenseDefaultsInput: Ref<string[]>
  hiddenIncomeCustomsInput: Ref<string[]>
  hiddenExpenseCustomsInput: Ref<string[]>
}
export function useProfilePageCategories(inputs: CategoryInputs) {
  const toggleVisibility = (list: Ref<string[]>, category: string) => {
    const key = category.toLocaleLowerCase()
    const next = list.value.filter(item => item.toLocaleLowerCase() !== key)
    if (next.length === list.value.length) next.push(category)
    list.value = next
  }
  const mergeWithHidden = (visible: string[], hidden: string[]) => {
    const merged = [...visible]
    const seen = new Set(visible.map(value => value.toLocaleLowerCase()))
    for (const value of hidden) {
      const cleaned = value.trim()
      const key = cleaned.toLocaleLowerCase()
      if (!key || seen.has(key)) continue
      seen.add(key)
      merged.push(cleaned)
    }
    return merged
  }
  const defaultIncomeCategories = computed(() =>
    inputs.activeDefaultIncomeCategories.value.length > 0
      ? inputs.activeDefaultIncomeCategories.value
      : ['Ventas', 'Servicios', 'Salario', 'Otros']
  )
  const defaultExpenseCategories = computed(() =>
    inputs.activeDefaultExpenseCategories.value.length > 0
      ? inputs.activeDefaultExpenseCategories.value
      : ['Alimentacion', 'Servicios', 'Transporte', 'Salud', 'Otros']
  )

  const hiddenIncomeSet = computed(() =>
    new Set(inputs.hiddenIncomeDefaultsInput.value.map(value => value.toLocaleLowerCase()))
  )
  const hiddenExpenseSet = computed(() =>
    new Set(inputs.hiddenExpenseDefaultsInput.value.map(value => value.toLocaleLowerCase()))
  )
  const hiddenIncomeCustomSet = computed(() =>
    new Set(inputs.hiddenIncomeCustomsInput.value.map(value => value.toLocaleLowerCase()))
  )
  const hiddenExpenseCustomSet = computed(() =>
    new Set(inputs.hiddenExpenseCustomsInput.value.map(value => value.toLocaleLowerCase()))
  )

  const toggleDefaultVisibility = (type: CategoryType, category: string) =>
    toggleVisibility(type === 'income' ? inputs.hiddenIncomeDefaultsInput : inputs.hiddenExpenseDefaultsInput, category)
  const toggleCustomVisibility = (type: CategoryType, category: string) =>
    toggleVisibility(type === 'income' ? inputs.hiddenIncomeCustomsInput : inputs.hiddenExpenseCustomsInput, category)
  const incomeDefaultKeys = computed(() =>
    new Set(defaultIncomeCategories.value.map(value => value.toLocaleLowerCase()))
  )
  const expenseDefaultKeys = computed(() =>
    new Set(defaultExpenseCategories.value.map(value => value.toLocaleLowerCase()))
  )

  const visibleCustomIncomeCategories = computed(() =>
    inputs.activeIncomeCategories.value.filter(category => !incomeDefaultKeys.value.has(category.toLocaleLowerCase()))
  )
  const visibleCustomExpenseCategories = computed(() =>
    inputs.activeExpenseCategories.value.filter(category => !expenseDefaultKeys.value.has(category.toLocaleLowerCase()))
  )
  const customIncomeCategories = computed(() =>
    mergeWithHidden(visibleCustomIncomeCategories.value, inputs.activeHiddenIncomeCustoms.value))
  const customExpenseCategories = computed(() =>
    mergeWithHidden(visibleCustomExpenseCategories.value, inputs.activeHiddenExpenseCustoms.value))
  return {
    defaultIncomeCategories,
    defaultExpenseCategories,
    hiddenIncomeSet,
    hiddenExpenseSet,
    hiddenIncomeCustomSet,
    hiddenExpenseCustomSet,
    customIncomeCategories,
    customExpenseCategories,
    toggleDefaultVisibility,
    toggleCustomVisibility
  }
}
