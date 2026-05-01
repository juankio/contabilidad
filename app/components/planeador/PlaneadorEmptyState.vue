<script setup lang="ts">
// Dumb component para estado vacío
</script>

<template>
  <div class="anim-fade grid place-items-center rounded-2xl border border-dashed border-slate-200 py-14 text-center">
    <div
      class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
      style="background: var(--brand-50)"
    >
      <UIcon
        name="lucide:shopping-cart"
        class="h-6 w-6"
        :style="{ color: 'var(--brand-300)' }"
      />
    </div>
    <p class="text-sm font-medium text-slate-500">
      Sin planes aún
    </p>
    <p class="mt-1 text-xs text-slate-300">
      Agrega tu primera compra planeada.
    </p>
  </div>
</template>