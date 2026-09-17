import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { usePaymentStore } from '../store/payment-store'
import { queryKeys } from '../utils/query-keys'

/**
 * Salida única del flujo QR: limpia todo el estado del flujo
 * (qrResult, initiatedPayment, selectedDebts), elimina la caché
 * de active-qr para no mostrar un QR fantasma al re-entrar,
 * y navega a /menu. Todos los botones de salida deben usar
 * este hook para que la limpieza no dependa de qué botón pulse
 * el usuario.
 */
export function useExitQrFlow() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setQrResult = usePaymentStore((s) => s.setQrResult)
  const setInitiatedPayment = usePaymentStore((s) => s.setInitiatedPayment)
  const setSelectedDebts = usePaymentStore((s) => s.setSelectedDebts)

  return () => {
    setQrResult(null)
    setInitiatedPayment(null)
    setSelectedDebts([])
    // remove (no invalidate): al re-entrar a Pago QR no debe servirse
    // el QR anterior desde caché; fuerza verificación fresca.
    queryClient.removeQueries({ queryKey: queryKeys.activeQrRoot })
    void queryClient.invalidateQueries({ queryKey: ['recent-payments'] })
    void queryClient.invalidateQueries({ queryKey: ['invoices-last-6-months'] })
    navigate('/menu', { replace: true })
  }
}
