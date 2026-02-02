<script setup lang="ts">
type Profile = {
  _id: string
  name: string
  avatarColor: string
}

defineProps<{
  profile: Profile
  isActive: boolean
  onSelect: (id: string) => void
  onRemove: (id: string) => void
}>()
</script>

<template>
  <UCard
    class="relative cursor-pointer border border-slate-200 transition hover:border-slate-300"
    :class="isActive ? 'ring-2 ring-slate-900' : ''"
    @click="onSelect(profile._id)"
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
          v-if="isActive"
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
      @click.stop="onRemove(profile._id)"
    >
      Eliminar
    </UButton>
  </UCard>
</template>
