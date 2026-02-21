<script setup lang="ts">
import ProfileCustomCategoriesSection from './ProfileCustomCategoriesSection.vue'
import ProfileDefaultCategoriesSection from './ProfileDefaultCategoriesSection.vue'

type CategoryType = 'income' | 'expense'

defineProps<{
  loading: boolean
  defaultIncomeCategories: string[]
  defaultExpenseCategories: string[]
  hiddenIncomeSet: Set<string>
  hiddenExpenseSet: Set<string>
  hiddenIncomeCustomSet: Set<string>
  hiddenExpenseCustomSet: Set<string>
  customIncomeCategories: string[]
  customExpenseCategories: string[]
}>()

const emit = defineEmits<{
  (e: 'toggle' | 'toggleCustom' | 'remove', type: CategoryType, category: string): void
}>()
</script>

<template>
  <div class="mt-6">
    <ProfileDefaultCategoriesSection
      title="Categorias base de ingresos"
      type="income"
      :categories="defaultIncomeCategories"
      :hidden-set="hiddenIncomeSet"
      @toggle="(type, category) => emit('toggle', type, category)"
    />
  </div>

  <div class="mt-4">
    <ProfileDefaultCategoriesSection
      title="Categorias base de gastos"
      type="expense"
      :categories="defaultExpenseCategories"
      :hidden-set="hiddenExpenseSet"
      @toggle="(type, category) => emit('toggle', type, category)"
    />
  </div>

  <div class="mt-6">
    <ProfileCustomCategoriesSection
      title="Categorias personalizadas (desde ingresos)"
      type="income"
      :categories="customIncomeCategories"
      :hidden-set="hiddenIncomeCustomSet"
      :loading="loading"
      empty-message="Aun no hay categorias personalizadas en ingresos."
      @toggle="(type, category) => emit('toggleCustom', type, category)"
      @remove="(type, category) => emit('remove', type, category)"
    />
  </div>

  <div class="mt-4">
    <ProfileCustomCategoriesSection
      title="Categorias personalizadas (desde gastos)"
      type="expense"
      :categories="customExpenseCategories"
      :hidden-set="hiddenExpenseCustomSet"
      :loading="loading"
      empty-message="Aun no hay categorias personalizadas en gastos."
      @toggle="(type, category) => emit('toggleCustom', type, category)"
      @remove="(type, category) => emit('remove', type, category)"
    />
  </div>

  <p class="mt-4 text-sm text-slate-500">
    Las categorias personalizadas se crean en Inicio y aqui puedes ocultarlas o eliminarlas.
  </p>
</template>
