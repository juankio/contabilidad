<script setup lang="ts">
import { useTrabajadores } from '../composables/trabajadores/useTrabajadores'
import TrabajadorForm from '../components/trabajadores/TrabajadorForm.vue'
import PagoForm from '../components/trabajadores/PagoForm.vue'
import { useResumen } from '../composables/useResumen'
import FormField from '../components/forms/FormField.vue'
import { useMoneyInput } from '../composables/forms/useMoneyInput'
import { computed, ref, onMounted } from 'vue'

definePageMeta({ requiresModule: 'trabajadores' })

const { activeProfileName } = useProfile()
const profileInitial = computed(() => activeProfileName.value?.trim().charAt(0).toUpperCase() || 'M')

const { trabajadores, loading, fetchTrabajadores, crearTrabajador, pagarTrabajador, editarTrabajador, eliminarTrabajador } = useTrabajadores()
const { resumen, formatCurrency } = await useResumen()

const saldoDisponible = computed(() => resumen.value?.saldoDisponible ?? resumen.value?.saldo ?? 0)

const toast = useToast()

const handleCrear = async (payload: any) => {
  try {
    await crearTrabajador(payload)
    toast.add({
      title: 'Trabajador creado',
      description: 'El trabajador ha sido añadido exitosamente a la plantilla.',
      icon: 'lucide:check-circle',
      color: 'success'
    })
  } catch (err: any) {
    toast.add({
      title: 'Error al crear',
      description: err.message || 'No se pudo crear el trabajador.',
      icon: 'lucide:alert-circle',
      color: 'error'
    })
  }
}

const handlePagar = async (payload: any) => {
  try {
    await pagarTrabajador(payload)
    toast.add({
      title: 'Pago exitoso',
      description: 'El pago ha sido registrado y descontado de tus fondos.',
      icon: 'lucide:check-circle',
      color: 'success'
    })
  } catch (err: any) {
    toast.add({
      title: 'No se pudo procesar',
      description: err.message || 'Error al pagar.',
      icon: 'lucide:alert-circle',
      color: 'error'
    })
  }
}

// Edit state
const isEditModalOpen = ref(false)
const selectedTrabajador = ref<any>(null)
const editForm = ref({ nombre: '', cargo: '', salario: 0 })

const editFormSalarioRef = computed({
  get: () => editForm.value.salario,
  set: (val) => editForm.value.salario = val
})
const { amountInput: editSalarioInput } = useMoneyInput(editFormSalarioRef)

const openEdit = (trabajador: any) => {
  selectedTrabajador.value = trabajador
  editForm.value = {
    nombre: trabajador.nombre,
    cargo: trabajador.cargo,
    salario: trabajador.salario
  }
  isEditModalOpen.value = true
}

const handleEditar = async () => {
  if (!selectedTrabajador.value) return

  try {
    await editarTrabajador(selectedTrabajador.value._id, editForm.value)
    isEditModalOpen.value = false
    toast.add({
      title: 'Trabajador actualizado',
      description: 'Los datos han sido guardados correctamente.',
      icon: 'lucide:check-circle',
      color: 'success'
    })
  } catch (err: any) {
    toast.add({
      title: 'Error al actualizar',
      description: err.message || 'No se pudo editar el trabajador.',
      icon: 'lucide:alert-circle',
      color: 'error'
    })
  }
}

// Delete state
const isDeleteModalOpen = ref(false)
const trabajadorToDelete = ref<any>(null)

const openDelete = (trabajador: any) => {
  trabajadorToDelete.value = trabajador
  isDeleteModalOpen.value = true
}

const handleEliminar = async () => {
  if (!trabajadorToDelete.value) return

  try {
    await eliminarTrabajador(trabajadorToDelete.value._id)
    isDeleteModalOpen.value = false
    toast.add({
      title: 'Trabajador eliminado',
      description: 'El trabajador ha sido dado de baja exitosamente.',
      icon: 'lucide:check-circle',
      color: 'success'
    })
  } catch (err: any) {
    toast.add({
      title: 'Error al eliminar',
      description: err.message || 'No se pudo eliminar el trabajador.',
      icon: 'lucide:alert-circle',
      color: 'error'
    })
  }
}

const getDropdownItems = (t: any) => [
  [{
    label: 'Editar',
    icon: 'lucide:pencil',
    onSelect: () => openEdit(t)
  }],
  [{
    label: 'Eliminar',
    icon: 'lucide:trash-2',
    color: 'error',
    onSelect: () => openDelete(t)
  }]
]

onMounted(() => fetchTrabajadores())
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <section class="mx-auto max-w-screen-2xl px-4 pb-10 pt-6">
      <header class="anim-up rounded-3xl bg-white p-5 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div
              class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm"
              style="background: var(--brand-600)"
            >
              <span class="text-sm font-bold text-white">{{ profileInitial }}</span>
              <span class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-700">
                <UIcon
                  name="lucide:users"
                  class="h-3 w-3 text-white"
                />
              </span>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Módulo
              </p>
              <h1 class="text-2xl font-bold tracking-tight text-slate-900">
                Trabajadores y Nómina
              </h1>
            </div>
          </div>

          <div class="flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-2 border border-emerald-100">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <UIcon
                name="lucide:wallet"
                class="h-4 w-4"
              />
            </div>
            <div>
              <p class="text-xs text-emerald-600 font-medium">
                Disponible para pagos
              </p>
              <p class="text-lg font-bold text-emerald-700">
                {{ formatCurrency(saldoDisponible) }}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <TrabajadorForm @submit="handleCrear" />
        <PagoForm
          :trabajadores="trabajadores"
          @submit="handlePagar"
        />
      </div>

      <div class="anim-up-3 mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
        <div class="mb-5 flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <UIcon
                name="lucide:users"
                class="h-5 w-5"
              />
            </div>
            <div>
              <h2 class="text-lg font-bold tracking-tight text-slate-900">
                Plantilla Actual
              </h2>
              <p class="text-sm text-slate-500">
                Personal activo de la empresa.
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="loading"
          class="flex items-center gap-2 text-sm text-slate-500 py-4"
        >
          <UIcon
            name="lucide:loader-2"
            class="h-4 w-4 animate-spin"
          />
          Cargando...
        </div>
        <div
          v-else-if="trabajadores.length === 0"
          class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-8 text-center"
        >
          <UIcon
            name="lucide:inbox"
            class="mb-2 h-8 w-8 text-slate-300"
          />
          <p class="text-sm font-medium text-slate-600">
            No hay trabajadores
          </p>
          <p class="text-xs text-slate-500">
            Agrega el primero para empezar.
          </p>
        </div>
        <div
          v-else
          class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div
            v-for="t in trabajadores"
            :key="t._id"
            class="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
                  <span class="text-sm font-bold text-primary">{{ t.nombre.charAt(0).toUpperCase() }}</span>
                </div>
                <div>
                  <p class="font-semibold text-slate-900 line-clamp-1">
                    {{ t.nombre }}
                  </p>
                  <p class="text-xs text-slate-500">
                    {{ t.cargo }}
                  </p>
                </div>
              </div>
              <UDropdownMenu
                :items="getDropdownItems(t)"
                :popper="{ placement: 'bottom-end' }"
              >
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="lucide:more-vertical"
                  class="text-slate-400 hover:text-slate-600"
                />
              </UDropdownMenu>
            </div>

            <div class="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
              <span class="text-xs text-slate-500">Salario base</span>
              <p class="text-sm font-semibold text-slate-900">
                {{ formatCurrency(t.salario) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal Editar -->
    <UModal v-model="isEditModalOpen" :ui="{ content: 'sm:max-w-md sm:rounded-[2rem]', overlay: 'backdrop-blur-md bg-white/10 dark:bg-black/40' }">
      <template #content>
        <UCard :ui="{ root: 'ring-0 shadow-none divide-none', header: 'px-8 pt-8 pb-4', body: 'px-8 pb-8 pt-0' }" class="rounded-[2rem]">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                  <UIcon name="lucide:pencil" class="h-5 w-5" />
                </div>
                <h3 class="text-lg font-bold leading-6 text-slate-900">
                  Editar Trabajador
                </h3>
              </div>
              <UButton
                color="neutral"
                variant="ghost"
                icon="lucide:x"
                class="-my-1"
                @click="isEditModalOpen = false"
              />
            </div>
          </template>

          <form
            class="flex flex-col gap-6"
            @submit.prevent="handleEditar"
          >
            <FormField label="Nombre" for-id="edit-nombre">
              <UInput
                id="edit-nombre"
                v-model="editForm.nombre"
                placeholder="Nombre completo"
                icon="lucide:user"
                size="lg"
                required
              />
            </FormField>
            
            <FormField label="Cargo" for-id="edit-cargo">
              <UInput
                id="edit-cargo"
                v-model="editForm.cargo"
                placeholder="Puesto que desempeña"
                icon="lucide:briefcase"
                size="lg"
                required
              />
            </FormField>
            
            <FormField label="Salario Base" for-id="edit-salario">
              <UInput
                id="edit-salario"
                v-model="editSalarioInput"
                type="text"
                inputmode="numeric"
                icon="lucide:circle-dollar-sign"
                size="lg"
                required
                placeholder="0"
              />
            </FormField>

            <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <UButton
                color="neutral"
                variant="soft"
                size="lg"
                @click="isEditModalOpen = false"
              >
                Cancelar
              </UButton>
              <UButton
                type="submit"
                color="primary"
                size="lg"
                icon="lucide:save"
                class="font-semibold shadow-sm"
              >
                Guardar Cambios
              </UButton>
            </div>
          </form>
        </UCard>
      </template>
    </UModal>

    <!-- Modal Eliminar -->
    <UModal v-model="isDeleteModalOpen" :ui="{ content: 'sm:max-w-md sm:rounded-[2rem]', overlay: 'backdrop-blur-md bg-white/10 dark:bg-black/40' }">
      <template #content>
        <UCard :ui="{ root: 'ring-0 shadow-none divide-none', header: 'px-8 pt-8 pb-4', body: 'px-8 pb-8 pt-0' }" class="rounded-[2rem]">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 text-red-600">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                  <UIcon name="lucide:alert-triangle" class="h-5 w-5" />
                </div>
                <h3 class="text-lg font-bold leading-6 text-slate-900">
                  Eliminar Trabajador
                </h3>
              </div>
              <UButton
                color="neutral"
                variant="ghost"
                icon="lucide:x"
                class="-my-1"
                @click="isDeleteModalOpen = false"
              />
            </div>
          </template>

          <div class="py-2">
            <p class="text-slate-600">
              ¿Estás seguro que deseas eliminar a <strong class="text-slate-900 font-bold">{{ trabajadorToDelete?.nombre }}</strong> de la plantilla?
            </p>
            <p class="mt-2 text-sm text-slate-500">
              Esta acción no se puede deshacer. Se mantendrá el historial de pagos realizados, pero el trabajador ya no aparecerá en la plantilla activa.
            </p>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <UButton
              color="neutral"
              variant="soft"
              size="lg"
              @click="isDeleteModalOpen = false"
            >
              Cancelar
            </UButton>
            <UButton
              color="error"
              size="lg"
              icon="lucide:trash-2"
              class="font-semibold shadow-sm"
              @click="handleEliminar"
            >
              Sí, eliminar
            </UButton>
          </div>
        </UCard>
      </template>
    </UModal>
  </main>
</template>
