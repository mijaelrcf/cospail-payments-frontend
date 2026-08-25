import { useQuery } from '@tanstack/react-query'
import { getRecentPayments } from '../api/payments'

// Status: CospailRegistrado, QRGenerado, QREscaneado, QRPagado, QRRechazado
// Use CospailRegistrado to get all payments paid, 
// use QRGenerado to get only for test.
// const DEFAULT_STATUS = 'CospailRegistrado' 
const DEFAULT_STATUS = 'QRGenerado'

export const useRecentPayments = (fixedCode: number | null | undefined) => {
  return useQuery({
    queryKey: ['recent-payments', fixedCode],
    queryFn: () => getRecentPayments(fixedCode!, DEFAULT_STATUS),
    enabled: Boolean(fixedCode),
  })
}
