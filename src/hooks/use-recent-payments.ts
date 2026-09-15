import { useQuery } from '@tanstack/react-query'
import { getRecentPayments } from '../api/payments'
import { queryKeys } from '../utils/query-keys'

// Status: PagoRegistrado, QRGenerado, QRPagado, QRRechazado
// PagoRegistrado = deuda pagada (BanEco) y registrada (Cospail).
const DEFAULT_STATUS = 'PagoRegistrado'

export const useRecentPayments = (fixedCode: number | null | undefined) => {
  return useQuery({
    queryKey: [...queryKeys.recentPayments(fixedCode), DEFAULT_STATUS],
    queryFn: () => {
      if (!fixedCode) throw new Error('fixedCode es requerido')
      return getRecentPayments(fixedCode, DEFAULT_STATUS)
    },
    enabled: Boolean(fixedCode),
  })
}
