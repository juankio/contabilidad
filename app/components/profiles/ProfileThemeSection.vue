<script setup lang="ts">
import { useTheme, THEMES } from '../../composables/useTheme'
import { useProfile } from '../../composables/useProfile'

const { activeColor, setProfileTheme } = useTheme()
const { activeProfile, activeProfileId, updateProfileThemeColor } = useProfile()
const saving = ref(false)

const activeTheme = computed(() => THEMES.find(t => t.key === activeColor.value))

async function select(key: typeof THEMES[number]['key']) {
  const profileId = activeProfileId.value
  setProfileTheme(key, profileId ?? 'global')

  if (!profileId || activeProfile.value?.themeColor === key) return

  saving.value = true
  try {
    await updateProfileThemeColor(key)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-4">
    <div class="flex items-center gap-2 text-slate-700">
      <UIcon
        name="lucide:palette"
        class="h-4 w-4"
      />
      <p class="text-sm font-semibold">
        Color del perfil
      </p>
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <button
        v-for="t in THEMES"
        :key="t.key"
        type="button"
        class="relative h-8 w-8 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        :style="{ background: t.swatch }"
        :title="t.label"
        :disabled="saving"
        @click="select(t.key)"
      >
        <Transition name="check">
          <span
            v-if="activeColor === t.key"
            class="absolute inset-0 flex items-center justify-center rounded-full ring-2 ring-white ring-offset-2"
            :style="{ '--tw-ring-offset-color': t.swatch }"
          >
            <svg
              class="h-3.5 w-3.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="3.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
        </Transition>
      </button>
    </div>

    <div
      v-if="activeTheme"
      class="mt-4 flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
    >
      <span
        class="h-3.5 w-3.5 rounded-full shrink-0"
        :style="{ background: activeTheme.swatch }"
      />
      <span class="text-sm font-medium text-slate-700">{{ activeTheme.label }}</span>
      <span class="ml-auto text-xs text-slate-400">Solo este perfil</span>
    </div>
  </div>
</template>

<style scoped>
.check-enter-active { transition: all 0.15s cubic-bezier(0.22, 1, 0.36, 1); }
.check-leave-active { transition: all 0.1s ease; }
.check-enter-from, .check-leave-to { opacity: 0; transform: scale(0.5); }
</style>
