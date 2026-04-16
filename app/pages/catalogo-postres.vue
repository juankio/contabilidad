<script setup lang="ts">
import PostresHeader from '../components/postres/PostresHeader.vue'
import PostresCatalogoCard from '../components/postres/PostresCatalogoCard.vue'
import PostresInsumosCard from '../components/postres/PostresInsumosCard.vue'
import PostresRecetasCard from '../components/postres/PostresRecetasCard.vue'
import PostresVentasCard from '../components/postres/PostresVentasCard.vue'
import PostresReporteCard from '../components/postres/PostresReporteCard.vue'

definePageMeta({
  requiresModule: 'catalogo-postres'
})
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-screen-2xl px-4 pb-12 pt-6">
      <PostresHeader class="anim-up lg:col-span-12" />

      <!-- Layout optimizado sin bento raro -->
      <div class="mt-6 grid min-w-0 gap-6 lg:grid-cols-12 items-start">
        
        <!-- Columna Izquierda: Datos Base (Postres, Insumos, Ventas) -->
        <div class="flex flex-col gap-6 lg:col-span-4">
          <PostresCatalogoCard class="anim-up-1 shadow-sm hover:shadow-md transition-shadow" />
          <PostresInsumosCard class="anim-up-2 shadow-sm hover:shadow-md transition-shadow" />
          <PostresVentasCard class="anim-up-3 shadow-sm hover:shadow-md transition-shadow" />
        </div>

        <!-- Columna Central: Recetas (más espacio) -->
        <div class="flex flex-col gap-6 lg:col-span-5">
          <PostresRecetasCard class="anim-up-4 shadow-sm hover:shadow-md transition-shadow" />
        </div>

        <!-- Columna Derecha: Reporte -->
        <div class="flex flex-col gap-6 lg:col-span-3">
          <PostresReporteCard class="anim-up-5 shadow-sm hover:shadow-md transition-shadow" />
        </div>

      </div>
    </section>
  </main>
</template>
