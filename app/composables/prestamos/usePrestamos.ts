import { paymentPlanLabel } from './helpers'
import { usePrestamosData } from './usePrestamosData'
import { usePrestamoCreate } from './usePrestamoCreate'
import { usePrestamoAbonos } from './usePrestamoAbonos'
import { usePrestamoDelete } from './usePrestamoDelete'

export function usePrestamos() {
  const dataState = usePrestamosData()
  const createState = usePrestamoCreate(dataState.refresh)
  const abonosState = usePrestamoAbonos(dataState.prestamos, dataState.refresh)
  const deleteState = usePrestamoDelete(dataState.refresh, {
    createSuccess: createState.createSuccess,
    onDeleted: (prestamo) => {
      abonosState.closeAbonoFor(prestamo._id)
    }
  })

  return {
    ...dataState,
    ...createState,
    ...abonosState,
    ...deleteState,
    paymentPlanLabel
  }
}

export type PrestamosController = ReturnType<typeof usePrestamos>
