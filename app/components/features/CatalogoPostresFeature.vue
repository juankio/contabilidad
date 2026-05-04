<script setup lang="ts">
const {
  insumos,
  postres,
  ventas,
  loadingData,
  fetchData
} = usePostres()

onMounted(() => {
  fetchData()
})
</script>

<template>
  <main class="min-h-screen bg-transparent pb-12 pt-8 text-slate-900">
    <section class="mx-auto max-w-screen-2xl overflow-x-clip px-4 md:px-6">
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
