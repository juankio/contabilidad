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
    <section class="mx-auto max-w-5xl px-4 pb-10 pt-6">
      <PostresHeader class="anim-up" />

      <!--
        Bento grid (desktop):
        Col 1        | Col 2        | Col 3
        ─────────────┼──────────────┼────────────
        Postres      │ Recetas (2c) │ Reporte
        Insumos      │              │ (tall, 2r)
        Ventas (2c)  │              │
      -->
      <div class="bento-grid mt-6 grid gap-5">
        <PostresCatalogoCard class="anim-up-1 bento-postres" />
        <PostresInsumosCard class="anim-up-2 bento-insumos" />
        <PostresRecetasCard class="anim-up-3 bento-recetas" />
        <PostresVentasCard class="anim-up-4 bento-ventas" />
        <PostresReporteCard class="anim-up-5 bento-reporte" />
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Mobile: single column */
.bento-grid {
  grid-template-columns: 1fr;
}

/* Desktop: 3-column bento */
@media (min-width: 1024px) {
  .bento-grid {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto auto auto;
  }

  /* Col 1, row 1 */
  .bento-postres { grid-column: 1; grid-row: 1; }

  /* Col 1, row 2 */
  .bento-insumos { grid-column: 1; grid-row: 2; }

  /* Col 2 spans 2 cols (2+3), row 1–2 */
  .bento-recetas { grid-column: 2 / 4; grid-row: 1 / 3; }

  /* Col 1–2, row 3 */
  .bento-ventas  { grid-column: 1 / 3; grid-row: 3; }

  /* Col 3, row 3 — continues reporte which started at row 1 */
  .bento-reporte { grid-column: 3; grid-row: 3; }
}

/* Tablet: 2-column */
@media (min-width: 640px) and (max-width: 1023px) {
  .bento-grid {
    grid-template-columns: 1fr 1fr;
  }
  .bento-recetas { grid-column: 1 / 3; }
  .bento-ventas  { grid-column: 1 / 3; }
  .bento-reporte { grid-column: 1 / 3; }
}
</style>
