import { useQuery } from '@tanstack/react-query'
import { getRecentPayments } from '../api/payments'

// Status: PagoRegistrado, QRGenerado, QRPagado, QRRechazado
// Use PagoRegistrado para obtener la deuda pagada (BanEco) y registrada (Cospail).
// Use otro estado para probar.
const DEFAULT_STATUS = 'PagoRegistrado'

export const useRecentPayments = (fixedCode: number | null | undefined) => {
  return useQuery({
    queryKey: ['recent-payments', fixedCode],
    queryFn: () => getRecentPayments(fixedCode!, DEFAULT_STATUS),
    enabled: Boolean(fixedCode),
  })
}
