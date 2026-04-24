<script setup lang="ts">
const props = defineProps<{
  themeColor: string
}>()

const emit = defineEmits<{
  (e: 'update:themeColor', color: string): void
}>()

const colors = ['sky', 'blue', 'indigo', 'violet', 'fuchsia', 'rose', 'emerald', 'teal', 'amber']

function getColorHex(color: string) {
  const map: Record<string, string> = {
    sky: '#0ea5e9',
    blue: '#3b82f6',
    indigo: '#6366f1',
    violet: '#8b5cf6',
    fuchsia: '#d946ef',
    rose: '#f43f5e',
    emerald: '#10b981',
    teal: '#14b8a6',
    amber: '#f59e0b'
  }
  return map[color] || map.violet
}
</script>

<template>
  <div class="grid gap-2 text-sm anim-fade">
    <p class="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-1">
      Color de tu espacio
    </p>
    <div class="flex flex-wrap gap-2.5">
      <button
        v-for="color in colors"
        :key="color"
        type="button"
        class="relative h-10 w-10 rounded-full transition-all duration-200 border-2"
        :class="themeColor === color ? 'border-slate-800 scale-110 shadow-md ring-2 ring-white ring-inset' : 'border-transparent hover:scale-110'"
        :style="{ backgroundColor: getColorHex(color) }"
        @click="emit('update:themeColor', color)"
      >
        <UIcon
          v-if="themeColor === color"
          name="lucide:check"
          class="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-md"
        />
      </button>
    </div>
  </div>
</template>
