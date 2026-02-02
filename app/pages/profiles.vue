<script setup lang="ts">
type Profile = {
  _id: string
  name: string
  avatarColor: string
}

const { data, pending, refresh } = await useFetch<{
  profiles: Profile[]
  activeProfileId: string | null
}>('/api/profiles')

const profiles = computed(() => data.value?.profiles ?? [])
const activeProfileId = computed(() => data.value?.activeProfileId ?? null)
const newName = ref('')
const errorMessage = ref('')
const creating = ref(false)

const selectProfile = async (profileId: string) => {
  await $fetch('/api/profiles/active', {
    method: 'POST',
    body: { profileId }
  })
  await refresh()
  await refreshAuthUser()
  await navigateTo('/')
}

const createProfile = async () => {
  if (!newName.value.trim()) return
  errorMessage.value = ''
  creating.value = true
  try {
    await $fetch('/api/profiles', {
      method: 'POST',
      body: { name: newName.value.trim() }
    })
    newName.value = ''
    await refresh()
    await refreshAuthUser()
  } catch (error: unknown) {
    errorMessage.value = (error as { data?: { statusMessage?: string } })?.data?.statusMessage
      || 'No se pudo crear el perfil'
  } finally {
    creating.value = false
  }
}

const removeProfile = async (profileId: string) => {
  await $fetch(`/api/profiles/${profileId}`, { method: 'DELETE' })
  await refresh()
  await refreshAuthUser()
}

const logout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await refreshAuthUser()
  await navigateTo('/login')
}
</script>

<template>
  <main class="min-h-screen bg-white text-slate-900">
    <section class="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-12">
      <header class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-slate-400">
            Perfiles
          </p>
          <h1 class="text-2xl font-semibold">
            Selecciona un perfil
          </h1>
        </div>
        <UButton
          variant="outline"
          color="neutral"
          size="sm"
          @click="logout"
        >
          Cerrar sesion
        </UButton>
      </header>

      <section class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <UCard
          v-for="profile in profiles"
          :key="profile._id"
          class="relative cursor-pointer border border-slate-200 transition hover:border-slate-300"
          :class="profile._id === activeProfileId ? 'ring-2 ring-slate-900' : ''"
          @click="selectProfile(profile._id)"
        >
          <div class="flex items-center gap-3">
            <span
              class="grid h-12 w-12 place-items-center rounded-xl text-lg font-semibold text-white"
              :style="{ backgroundColor: profile.avatarColor }"
            >
              {{ profile.name.slice(0, 1).toUpperCase() }}
            </span>
            <div>
              <p class="font-semibold text-slate-900">
                {{ profile.name }}
              </p>
              <p
                v-if="profile._id === activeProfileId"
                class="text-xs text-slate-500"
              >
                Activo
              </p>
            </div>
          </div>
          <UButton
            class="absolute right-3 top-3"
            variant="ghost"
            color="neutral"
            size="xs"
            @click.stop="removeProfile(profile._id)"
          >
            Eliminar
          </UButton>
        </UCard>

        <UCard class="border border-dashed border-slate-200 bg-slate-50">
          <p class="text-sm font-semibold text-slate-700">
            Nuevo perfil
          </p>
          <UInput
            v-model="newName"
            type="text"
            placeholder="Nombre"
            size="lg"
            class="mt-3"
            @keydown.enter.prevent="createProfile"
          />
          <UButton
            class="mt-3"
            color="neutral"
            size="lg"
            block
            :loading="creating"
            @click="createProfile"
          >
            Agregar
          </UButton>
          <p
            v-if="errorMessage"
            class="mt-2 text-xs text-red-500"
          >
            {{ errorMessage }}
          </p>
        </UCard>
      </section>

      <p
        v-if="pending"
        class="text-sm text-slate-500"
      >
        Cargando perfiles...
      </p>
    </section>
  </main>
</template>
