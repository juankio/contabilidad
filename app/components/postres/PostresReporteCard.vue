<script setup lang="ts">
import { usePostres } from '../../composables/postres/usePostres'

const { report, sending, sendError, sendSuccess, sendToContabilidad } = usePostres()
</script>

<template>
  <section class="rounded-3xl bg-white p-5 shadow-sm">
    <!-- Header -->
    <div class="mb-4 flex items-center justify-between">
      <div>
        <div class="flex items-center gap-2 text-slate-700">
          <UIcon
            name="lucide:bar-chart-2"
            class="h-4 w-4"
          />
          <p class="text-sm font-semibold">
            Reporte del periodo
          </p>
        </div>
        <p class="mt-1 text-xs text-slate-400">
          Ganancias y costos
        </p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 gap-3">
      <div class="rounded-2xl bg-slate-50 px-4 py-3">
        <p class="text-xs uppercase tracking-[0.15em] text-slate-500">
          Ingresos
        </p>
        <p class="mt-1 text-lg font-semibold tabular-nums text-slate-900">
          COP {{ Number(report.ingresos).toLocaleString() }}
        </p>
      </div>
      <div class="rounded-2xl bg-slate-50 px-4 py-3">
        <p class="text-xs uppercase tracking-[0.15em] text-slate-500">
          Costos
        </p>
        <p class="mt-1 text-lg font-semibold tabular-nums text-slate-900">
          COP {{ Number(report.costos).toLocaleString() }}
        </p>
      </div>
      <div class="rounded-2xl bg-slate-100 px-4 py-3">
        <p class="text-xs uppercase tracking-[0.15em] text-slate-500">
          Utilidad
        </p>
        <p class="mt-1 text-lg font-semibold tabular-nums text-slate-900">
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
