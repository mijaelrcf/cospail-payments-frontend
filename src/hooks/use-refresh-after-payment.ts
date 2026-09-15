import { useQueryClient } from '@tanstack/react-query'
import { getMemberDebtByDocument } from '../api/payments'
import { usePaymentStore } from '../store/payment-store'
import { queryKeys } from '../utils/query-keys'

/**
 * Lógica compartida que antes estaba duplicada en pago-qr y qr-result:
 * limpia selección, refetcha deuda y invalida cachés relacionadas.
 */
export function useRefreshAfterPayment() {
  const queryClient = useQueryClient()
  const setDebtResponse = usePaymentStore((s) => s.setDebtResponse)
  const setSelectedDebts = usePaymentStore((s) => s.setSelectedDebts)

  return async (fixedCode?: number | null, documentId?: string | null) => {
    setSelectedDebts([])
    if (fixedCode && documentId) {
      try {
        const fresh = await getMemberDebtByDocument(fixedCode, documentId)
        setDebtResponse(fresh)
        setSelectedDebts([])
      } catch {
        // Si el refetch falla, igual se limpió la selección.
      }
    }
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.activeQrRoot }),
      queryClient.invalidateQueries({ queryKey: ['recent-payments'] }),
      queryClient.invalidateQueries({ queryKey: ['invoices-last-6-months'] }),
    ])
  }
}
