<script setup lang="ts">
import ProfileCustomCategoriesSection from '../components/profiles/ProfileCustomCategoriesSection.vue'
import ProfileDefaultCategoriesSection from '../components/profiles/ProfileDefaultCategoriesSection.vue'
import { useProfilePage } from '../composables/profile/useProfilePage'

const {
  nameInput,
  loading,
  errorMessage,
  defaultIncomeCategories,
  defaultExpenseCategories,
  hiddenIncomeSet,
  hiddenExpenseSet,
  customIncomeCategories,
  customExpenseCategories,
  toggleDefaultVisibility,
  deleteCustomCategory,
  save
} = useProfilePage()
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-4xl px-4 pb-10 pt-6">
      <header class="mb-6 rounded-2xl bg-white/80 p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-400">
          Perfil
        </p>
        <h1 class="text-2xl font-semibold text-slate-900">
          Editar perfil
        </h1>
      </header>

      <div class="rounded-3xl bg-white p-5 shadow-sm">
        <div class="grid gap-2 text-sm text-slate-600">
          <label for="profile-name">Nombre del perfil</label>
          <UInput
            id="profile-name"
            v-model="nameInput"
            type="text"
            size="lg"
            autocomplete="nickname"
          />
        </div>

        <div class="mt-6">
          <ProfileDefaultCategoriesSection
            title="Categorias base de ingresos"
            type="income"
            :categories="defaultIncomeCategories"
            :hidden-set="hiddenIncomeSet"
            @toggle="toggleDefaultVisibility"
          />
        </div>

        <div class="mt-4">
          <ProfileDefaultCategoriesSection
            title="Categorias base de gastos"
            type="expense"
            :categories="defaultExpenseCategories"
            :hidden-set="hiddenExpenseSet"
            @toggle="toggleDefaultVisibility"
          />
        </div>

        <div class="mt-6">
          <ProfileCustomCategoriesSection
            title="Categorias personalizadas (desde ingresos)"
            type="income"
            :categories="customIncomeCategories"
            :loading="loading"
            empty-message="Aun no hay categorias personalizadas en ingresos."
            @remove="deleteCustomCategory"
          />
        </div>

        <div class="mt-4">
          <ProfileCustomCategoriesSection
            title="Categorias personalizadas (desde gastos)"
            type="expense"
            :categories="customExpenseCategories"
            :loading="loading"
            empty-message="Aun no hay categorias personalizadas en gastos."
            @remove="deleteCustomCategory"
          />
        </div>

        <p class="mt-4 text-sm text-slate-500">
          Las categorias personalizadas se crean al guardar un movimiento con una categoria nueva en Inicio.
        </p>

        <p
          v-if="errorMessage"
          class="mt-3 text-sm text-red-500"
        >
          {{ errorMessage }}
        </p>

        <div class="mt-6 flex items-center justify-end gap-3">
          <UButton
            color="neutral"
            variant="ghost"
            type="button"
            :disabled="loading"
            @click="navigateTo('/')"
          >
            Cancelar
          </UButton>
          <UButton
            color="neutral"
            type="button"
            :loading="loading"
            :disabled="nameInput.trim().length < 2"
            @click="save"
          >
            Guardar perfil
          </UButton>
        </div>
      </div>
    </section>
  </main>
</template>
