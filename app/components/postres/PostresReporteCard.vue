<script setup lang="ts">
import { usePostres } from '../../composables/postres/usePostres'

const { report, sending, sendError, sendSuccess, sendToContabilidad } = usePostres()
</script>

<template>
  <section class="rounded-3xl bg-white p-5 shadow-sm">
    <!-- Header -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50">
          <UIcon
            name="lucide:bar-chart-2"
            class="h-4 w-4 text-rose-500"
          />
        </div>
        <div>
          <h2 class="text-sm font-semibold text-slate-900">
            Reporte del periodo
          </h2>
          <p class="text-xs text-slate-400">
            Ganancias y costos
          </p>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 gap-3">
      <div class="rounded-2xl bg-emerald-50 px-4 py-3">
        <p class="text-xs uppercase tracking-[0.15em] text-emerald-600">
          Ingresos
        </p>
        <p class="mt-1 text-lg font-semibold tabular-nums text-emerald-700">
          COP {{ Number(report.ingresos).toLocaleString() }}
        </p>
      </div>
      <div class="rounded-2xl bg-rose-50 px-4 py-3">
        <p class="text-xs uppercase tracking-[0.15em] text-rose-600">
          Costos
        </p>
        <p class="mt-1 text-lg font-semibold tabular-nums text-rose-700">
          COP {{ Number(report.costos).toLocaleString() }}
        </p>
      </div>
      <div
        class="rounded-2xl px-4 py-3"
        style="background: var(--brand-50)"
      >
        <p
          class="text-xs uppercase tracking-[0.15em]"
          style="color: var(--brand-600)"
        >
          Utilidad
        </p>
        <p
          class="mt-1 text-lg font-semibold tabular-nums"
          style="color: var(--brand-700)"
        >
          COP {{ Number(report.utilidad).toLocaleString() }}
        </p>
      </div>
    </div>

    <!-- Send -->
    <div class="mt-4 flex items-center gap-3">
      <UButton
        color="primary"
        icon="i-lucide-send"
        size="sm"
        :loading="sending"
        @click="sendToContabilidad"
      >
        Enviar a contabilidad
      </UButton>
      <Transition name="fade">
        <p
          v-if="sendError"
          class="text-xs text-rose-500"
        >
          {{ sendError }}
        </p>
        <p
          v-else-if="sendSuccess"
          class="text-xs text-emerald-600"
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
