<script setup lang="ts">
defineProps<{
  mode: 'login' | 'register'
  registerStep: number
  disabled?: boolean
}>()

const email = defineModel<string>('email', { required: true })
const profileName = defineModel<string>('profileName', { required: true })
const password = defineModel<string>('password', { required: true })
const showPassword = defineModel<boolean>('showPassword', { required: true })
</script>

<template>
  <div class="anim-fade grid gap-1.5 text-sm">
    <label
      for="email"
      class="font-semibold text-slate-700"
    >Correo Electrónico</label>
    <UInput
      id="email"
      v-model="email"
      type="email"
      autocomplete="email"
      placeholder="tu@correo.com"
      required
      size="lg"
      :disabled="disabled"
      :ui="{ root: 'shadow-sm rounded-xl' }"
    >
      <template #leading>
        <UIcon
          name="lucide:mail"
          class="h-5 w-5 text-slate-400"
        />
      </template>
    </UInput>
  </div>

  <div
    v-if="mode === 'register'"
    class="anim-fade-1 grid gap-1.5 text-sm"
  >
    <label
      for="profileName"
      class="font-semibold text-slate-700"
    >Nombre del espacio de trabajo</label>
    <UInput
      id="profileName"
      v-model="profileName"
      type="text"
      autocomplete="nickname"
      placeholder="Ej: Mi Negocio"
      :required="mode === 'register'"
      size="lg"
      :disabled="disabled"
      :ui="{ root: 'shadow-sm rounded-xl' }"
    >
      <template #leading>
        <UIcon
          name="lucide:briefcase"
          class="h-5 w-5 text-slate-400"
        />
      </template>
    </UInput>
  </div>

  <div class="anim-fade-2 grid gap-1.5 text-sm">
    <label
      for="password"
      class="font-semibold text-slate-700"
    >Contraseña</label>
    <UInput
      id="password"
      v-model="password"
      :type="showPassword ? 'text' : 'password'"
      autocomplete="current-password"
      placeholder="••••••••"
      required
      size="lg"
      :disabled="disabled"
      :ui="{ root: 'shadow-sm rounded-xl' }"
    >
      <template #leading>
        <UIcon
          name="lucide:lock"
          class="h-5 w-5 text-slate-400"
        />
      </template>
      <template #trailing>
        <UButton
          variant="ghost"
          color="neutral"
          size="sm"
          type="button"
          :disabled="disabled"
          class="text-slate-400 hover:text-slate-600"
          @click="showPassword = !showPassword"
        >
          <UIcon
            :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
            class="h-5 w-5"
          />
        </UButton>
      </template>
    </UInput>
  </div>
</template>
