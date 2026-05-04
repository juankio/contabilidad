<script setup lang="ts">

const { activeColor, setProfileTheme } = useTheme()
const { activeProfile, activeProfileId, updateProfileThemeColor } = useProfile()
const open = ref(false)
const saving = ref(false)

async function select(key: typeof THEMES[number]['key']) {
  const profileId = activeProfileId.value
  setProfileTheme(key, profileId ?? 'global')
  open.value = false

  if (!profileId || activeProfile.value?.themeColor === key) {
    return
  }

  saving.value = true
  try {
    await updateProfileThemeColor(key)
  } finally {
    saving.value = false
  }
}

function onClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('[data-theme-picker]')) open.value = false
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div
    class="relative"
    data-theme-picker
  >
    <!-- Trigger -->
    <button
      type="button"
      class="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow active:scale-95"
      title="Color del tema"
      @click="open = !open"
    >
      <span
        class="h-4 w-4 rounded-full transition-all duration-300"
        :style="{ background: THEMES.find(t => t.key === activeColor)?.swatch ?? 'var(--brand-600)' }"
      />
    </button>

    <!-- Dropdown panel -->
    <Transition name="picker">
      <div
        v-if="open"
        class="absolute right-0 top-10 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
      >
        <p class="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
          Color del perfil
        </p>

        <!-- Color grid -->
        <div class="grid grid-cols-8 gap-1.5">
          <button
            v-for="t in THEMES"
            :key="t.key"
            type="button"
            class="group relative flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            :style="{ background: t.swatch }"
            :title="t.label"
            :disabled="saving"
            @click="select(t.key)"
          >
            <Transition name="check-mini">
              <span
                v-if="activeColor === t.key"
                class="absolute inset-0 flex items-center justify-center rounded-full ring-2 ring-white ring-offset-1"
                :style="{ '--tw-ring-offset-color': t.swatch }"
              >
                <svg
                  class="h-3 w-3 text-white"
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

        <!-- Current label -->
        <div class="mt-3 flex items-center gap-2 rounded-xl border border-slate-100 bg-transparent px-3 py-2">
          <span
            class="h-3 w-3 rounded-full"
            :style="{ background: THEMES.find(t => t.key === activeColor)?.swatch }"
          />
          <span class="text-xs font-medium text-slate-600">
            {{ THEMES.find(t => t.key === activeColor)?.label }}
          </span>
          <span class="ml-auto text-[10px] text-slate-400">
            Solo este perfil
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.picker-enter-active { transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1); }
.picker-leave-active { transition: all 0.15s ease; }
.picker-enter-from   { opacity: 0; transform: translateY(-6px) scale(0.97); }
.picker-leave-to     { opacity: 0; transform: translateY(-4px) scale(0.97); }

.check-mini-enter-active { transition: all 0.15s cubic-bezier(0.22, 1, 0.36, 1); }
.check-mini-leave-active { transition: all 0.1s ease; }
.check-mini-enter-from, .check-mini-leave-to { opacity: 0; transform: scale(0.5); }
</style>
