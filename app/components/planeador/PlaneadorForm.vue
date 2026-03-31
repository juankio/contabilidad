<script setup lang="ts">
import type { NuevoPlan } from '../../composables/planeador/usePlaneador'

const emit = defineEmits<{
  submit: [plan: NuevoPlan]
}>()

const props = defineProps<{
  submitting: boolean
  submitError: string | null
}>()

const form = reactive<NuevoPlan>({
  nombre: '',
  monto: '',
  fechaPlaneada: '',
  descripcion: ''
})

const minMes = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
})

const canSubmit = computed(() =>
  form.nombre.trim().length > 0
  && Number(form.monto) > 0
  && form.fechaPlaneada.length > 0
  && !props.submitting
)

function reset() {
  form.nombre = ''
  form.monto = ''
  form.fechaPlaneada = ''
  form.descripcion = ''
}

function onSubmit() {
  if (!canSubmit.value) return
  emit('submit', { ...form })
}

defineExpose({ reset })
</script>

<template>
  <div class="rounded-3xl bg-white p-5 shadow-sm">
    <div class="anim-up mb-4">
      <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
        Nueva compra
      </p>
      <h2 class="mt-1 text-lg font-semibold text-slate-900">
        Agregar al plan
      </h2>
    </div>

    <form
      class="space-y-3"
      @submit.prevent="onSubmit"
    >
      <!-- Nombre -->
      <div class="anim-up-1">
        <label class="mb-1.5 block text-xs font-medium text-slate-500">
          ¿Qué quieres comprar?
        </label>
        <input
          v-model="form.nombre"
          type="text"
          placeholder="Ej: Zapatos, celular, viaje..."
          maxlength="80"
          class="input-field w-full"
        >
      </div>

      <!-- Monto + Fecha -->
      <div class="anim-up-2 grid grid-cols-2 gap-3">
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-500">
            Cuánto cuesta
          </label>
          <input
            v-model="form.monto"
            type="number"
            min="1"
            step="any"
            placeholder="0"
            class="input-field w-full"
          >
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-500">
            ¿Para cuándo?
          </label>
          <input
            v-model="form.fechaPlaneada"
            type="month"
            :min="minMes"
            class="input-field w-full"
          >
        </div>
      </div>

      <!-- Nota -->
      <div class="anim-up-3">
        <label class="mb-1.5 block text-xs font-medium text-slate-500">
          Nota <span class="font-normal text-slate-300">(opcional)</span>
        </label>
        <input
          v-model="form.descripcion"
          type="text"
          placeholder="Por qué lo necesitas, dónde comprarlo..."
          maxlength="200"
          class="input-field w-full"
        >
      </div>

      <!-- Error -->
      <Transition name="slide-down">
        <p
          v-if="submitError"
          class="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-600"
        >
          {{ submitError }}
        </p>
      </Transition>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="!canSubmit"
        class="anim-up-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        :style="{
          background: submitting ? 'var(--brand-400)' : 'var(--brand-600)',
        }"
      >
        <UIcon
          v-if="submitting"
          name="lucide:loader-2"
          class="h-4 w-4 animate-spin"
        />
        <UIcon
          v-else
          name="lucide:plus"
          class="h-4 w-4 transition-transform duration-200 group-hover:rotate-90"
        />
        {{ submitting ? 'Guardando...' : 'Agregar al planeador' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.input-field {
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #0f172a;
  outline: none;
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
}

.input-field::placeholder {
  color: #94a3b8;
}

.input-field:focus {
  border-color: #c4b5fd;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgb(139 92 246 / 0.08);
}

/* Error slide */
.slide-down-enter-active { transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1); }
.slide-down-leave-active { transition: all 0.15s ease; }
.slide-down-enter-from   { opacity: 0; transform: translateY(-6px); }
.slide-down-leave-to     { opacity: 0; transform: translateY(-4px); }
</style>
