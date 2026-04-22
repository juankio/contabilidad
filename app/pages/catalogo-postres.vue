<script setup lang="ts">
import PostresHeader from '../components/postres/PostresHeader.vue'
import PostresCatalogoCard from '../components/postres/PostresCatalogoCard.vue'
import PostresInsumosCard from '../components/postres/PostresInsumosCard.vue'
import PostresRecetasCard from '../components/postres/PostresRecetasCard.vue'
import PostresVentasCard from '../components/postres/PostresVentasCard.vue'
import PostresReporteCard from '../components/postres/PostresReporteCard.vue'
import { usePostres } from '../composables/postres/usePostres'

definePageMeta({
  requiresModule: 'catalogo-postres'
})

const { fetchData } = usePostres()
onMounted(() => fetchData())
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-screen-2xl px-4 pb-6 pt-4">
      <PostresHeader class="anim-up lg:col-span-12" />

      <!-- Dashboard Layout Profesional -->
      <div class="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        <!-- Top row -->
        <PostresReporteCard class="anim-up-1 lg:col-span-3 shadow-sm hover:shadow-md transition-shadow" />

        <!-- Middle row -->
        <PostresVentasCard class="anim-up-2 lg:col-span-2 shadow-sm hover:shadow-md transition-shadow" />
        <PostresCatalogoCard class="anim-up-3 lg:col-span-1 shadow-sm hover:shadow-md transition-shadow" />

        <!-- Bottom row -->
        <PostresInsumosCard class="anim-up-4 lg:col-span-1 shadow-sm hover:shadow-md transition-shadow" />
        <PostresRecetasCard class="anim-up-5 lg:col-span-2 shadow-sm hover:shadow-md transition-shadow" />
      </div>
    </section>
  </main>
</template>
