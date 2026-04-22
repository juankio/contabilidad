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

const {
  insumos,
  postres,
  ventas,
  loadingData,
  fetchData
} = usePostres()

onMounted(() => fetchData())
</script>

<template>
  <main class="min-h-screen bg-slate-50/50 pb-12 pt-8 text-slate-900">
    <section class="mx-auto max-w-screen-2xl px-4 md:px-6">
      <!-- Header Module -->
      <PostresHeader
        class="anim-up min-w-0 lg:col-span-12"
        :insumos-count="insumos.length"
        :postres-count="postres.length"
        :ventas-count="ventas.length"
        :loading-data="loadingData"
      />

      <div class="mt-8 grid gap-8 lg:grid-cols-12">
        <!-- Columna Izquierda (Insumos y Recetas) -->
        <div class="flex flex-col gap-8 lg:col-span-8">
          <div class="grid gap-8 md:grid-cols-2 h-full">
            <PostresInsumosCard class="anim-up-1" />
            <PostresRecetasCard class="anim-up-2" />
          </div>
          
          <PostresCatalogoCard class="anim-up-3" />
        </div>

        <!-- Columna Derecha (Ventas y Reporte) -->
        <div class="flex flex-col gap-8 lg:col-span-4">
          <PostresVentasCard class="anim-up-4 flex-1" />
          <PostresReporteCard class="anim-up-5" />
        </div>
      </div>
    </section>
  </main>
</template>
