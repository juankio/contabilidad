<script setup lang="ts">
import { usePostres } from '../../composables/postres/usePostres'

const { report, sending, sendError, sendSuccess, sendToContabilidad } = usePostres()
</script>

<template>
  <section class="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow h-full">
    <!-- Header -->
    <div class="mb-5 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
          <UIcon name="lucide:bar-chart-2" class="h-5 w-5" />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight text-slate-900">
            Reporte
          </h2>
          <p class="text-sm text-slate-500">
            Ganancias y costos del periodo.
          </p>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="flex-1 grid grid-cols-1 gap-3">
      <div class="anim-up group flex flex-col justify-center rounded-3xl bg-emerald-50 px-4 py-3 transition-colors duration-200 hover:bg-emerald-100/60">
        <div class="flex items-center justify-between">
          <p class="text-xs font-semibold uppercase tracking-widest text-emerald-600">
            Ingresos brutos
          </p>
          <UIcon
            name="lucide:trending-up"
            class="h-3.5 w-3.5 text-emerald-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          />
        </div>
        <p class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-emerald-700">
          ${{ Number(report.ingresos).toLocaleString() }}
        </p>
      </div>

      <div class="anim-up-1 group flex flex-col justify-center rounded-3xl bg-rose-50 px-4 py-3 transition-colors duration-200 hover:bg-rose-100/60">
        <div class="flex items-center justify-between">
          <p class="text-xs font-semibold uppercase tracking-widest text-rose-600">
            Costos de materia prima
          </p>
          <UIcon
            name="lucide:trending-down"
            class="h-3.5 w-3.5 text-rose-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          />
        </div>
        <p class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-rose-700">
          -${{ Number(report.costos).toLocaleString() }}
        </p>
      </div>

      <div
        class="anim-up-2 flex flex-col justify-center rounded-3xl px-4 py-3 text-white shadow-sm transition-transform hover:scale-[1.01]"
        style="background: var(--brand-600, #2563eb);"
      >
        <p class="text-xs font-semibold uppercase tracking-widest text-white/70">
          Utilidad Neta
        </p>
        <p class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-white">
          ${{ Number(report.utilidad).toLocaleString() }}
        </p>
      </div>
    </div>

    <!-- Send -->
    <div class="mt-5 flex flex-col gap-3">
      <UButton
        color="warning"
        icon="lucide:send"
        size="lg"
        block
        :loading="sending"
        @click="sendToContabilidad"
      >
        Enviar utilidad a caja
      </UButton>
      <Transition name="fade">
        <p
          v-if="sendError"
          class="text-sm font-medium text-rose-500 text-center"
        >
          {{ sendError }}
        </p>
        <p
          v-else-if="sendSuccess"
          class="text-sm font-medium text-emerald-600 text-center"
        >
          {{ sendSuccess }}
        </p>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
