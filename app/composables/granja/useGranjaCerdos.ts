import { ref } from 'vue'
import { getRequestError } from '../prestamos/helpers'

export interface MuerteCerdo {
  _id?: string
  fecha: string | Date
  cantidad: number
  causa: string
}

export interface PartoCerdo {
  _id?: string
  fecha: string | Date
  nacidosVivos: number
  nacidosMuertos: number
  observaciones: string
}

export interface ComidaHorario {
  _id?: string
  hora: string
  formula: string
  cantidadKilos: number
}

export interface Lote {
  _id: string
  nombreLoteMadre: string
  fechaLlegada: string | Date
  cantidadInicial: number
  cantidadActual: number
  estado: 'activo' | 'vendido'
  partos: PartoCerdo[]
  muertes: MuerteCerdo[]
  horariosComida: ComidaHorario[]
  [key: string]: any
}

export interface LotePayload {
  nombreLoteMadre: string
  cantidadInicial: number
}

export interface ConcentradoPayload {
  formula: string
  kilos: number
  amount: number
}

export function useGranjaCerdos() {
  const lotes = ref<Lote[]>([])
  const loading = ref(false)

  const fetchLotes = async () => {
    loading.value = true
    try {
      lotes.value = await $fetch<Lote[]>('/api/granja/lotes')
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const crearLote = async (payload: LotePayload) => {
    try {
      await $fetch('/api/granja/lotes', { method: 'POST', body: payload })
      await fetchLotes()
    } catch (error) {
      throw new Error(getRequestError(error, 'No se pudo crear el lote'))
    }
  }

  const comprarConcentrado = async (payload: ConcentradoPayload) => {
    try {
      await $fetch('/api/granja/concentrado', { method: 'POST', body: payload })
    } catch (error) {
      throw new Error(getRequestError(error, 'No se pudo comprar el concentrado'))
    }
  }

  const editarLote = async (id: string, data: { nombreLoteMadre: string }) => {
    try {
      await $fetch(`/api/granja/lotes/${id}`, { method: 'PUT', body: data })
      await fetchLotes()
    } catch (error) {
      throw new Error(getRequestError(error, 'No se pudo editar el lote'))
    }
  }

  const eliminarLote = async (id: string) => {
    try {
      await $fetch(`/api/granja/lotes/${id}`, { method: 'DELETE' })
      await fetchLotes()
    } catch (error) {
      throw new Error(getRequestError(error, 'No se pudo eliminar el lote'))
    }
  }

  return { lotes, loading, fetchLotes, crearLote, comprarConcentrado, editarLote, eliminarLote }
}
