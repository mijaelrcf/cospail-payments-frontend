import { useQuery } from '@tanstack/react-query'
import { getPaymentStatus } from '../api/payments'
import { isPendingStatus } from '../types/payment-status'
import { queryKeys } from '../utils/query-keys'

const POLL_INTERVAL_MS = 5000

export function paymentStatusRefetchInterval(query: { state: { data?: { status: number } | undefined } }) {
  const status = query.state.data?.status
  return status !== undefined && isPendingStatus(status) ? POLL_INTERVAL_MS : false
}

export const usePaymentStatus = (pagoCospailId: string | null | undefined) => {
  return useQuery({
    queryKey: queryKeys.paymentStatus(pagoCospailId),
    queryFn: () => {
      if (!pagoCospailId) throw new Error('pagoCospailId es requerido')
      return getPaymentStatus(pagoCospailId)
    },
    enabled: Boolean(pagoCospailId),
    refetchInterval: paymentStatusRefetchInterval,
  })
}
