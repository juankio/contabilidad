<script setup lang="ts">
import ProfileCustomCategoriesSection from '../components/profiles/ProfileCustomCategoriesSection.vue'
import ProfileDefaultCategoriesSection from '../components/profiles/ProfileDefaultCategoriesSection.vue'
import { useProfilePage } from '../composables/profile/useProfilePage'

const {
  nameInput,
  profiles,
  activeProfileId,
  loading,
  errorMessage,
  newProfileName,
  profileActionMessage,
  profileActionError,
  defaultIncomeCategories,
  defaultExpenseCategories,
  hiddenIncomeSet,
  hiddenExpenseSet,
  customIncomeCategories,
  customExpenseCategories,
  toggleDefaultVisibility,
  deleteCustomCategory,
  createNewProfile,
  activateProfile,
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
          <p class="font-medium">
            Perfiles contables
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="profile in profiles"
              :key="profile._id"
              type="button"
              class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
              :class="profile._id === activeProfileId ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'"
              :disabled="loading || profile._id === activeProfileId"
              @click="activateProfile(profile._id)"
            >
              {{ profile.name }}
              <span
                v-if="profile._id === activeProfileId"
                class="font-semibold opacity-80"
              >Activo</span>
            </button>
          </div>

          <div class="mt-2 flex flex-col gap-2 sm:flex-row">
            <UInput
              v-model="newProfileName"
              type="text"
              size="lg"
              placeholder="Ej: Personal, Empresa ACME"
              class="sm:flex-1"
            />
            <UButton
              color="neutral"
              type="button"
              :loading="loading"
              :disabled="newProfileName.trim().length < 2"
              @click="createNewProfile()"
            >
              Crear perfil
            </UButton>
          </div>
          <div class="flex flex-wrap gap-2">
            <UButton
              color="neutral"
              variant="soft"
              size="xs"
              type="button"
              :loading="loading"
              @click="createNewProfile('Personal')"
            >
              + Personal
            </UButton>
            <UButton
              color="neutral"
              variant="soft"
              size="xs"
              type="button"
              :loading="loading"
              @click="createNewProfile('Empresa')"
            >
              + Empresa
            </UButton>
          </div>
        </div>

        <p
          v-if="profileActionMessage"
          class="mt-3 text-sm text-emerald-600"
        >
          {{ profileActionMessage }}
        </p>
        <p
          v-if="profileActionError"
          class="mt-2 text-sm text-rose-500"
        >
          {{ profileActionError }}
        </p>

        <div class="my-6 border-t border-slate-200" />

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
