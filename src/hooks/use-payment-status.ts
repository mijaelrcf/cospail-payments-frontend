import { useQuery } from '@tanstack/react-query'
import { getPaymentStatus } from '../api/payments'

const POLL_INTERVAL_MS = 5000

export function paymentStatusRefetchInterval(query: { state: { data?: { status: number } | undefined } }) {
  const status = query.state.data?.status
  return status === 0 || status === 1 ? POLL_INTERVAL_MS : false
}

export const usePaymentStatus = (pagoCospailId: string | null | undefined) => {
  return useQuery({
    queryKey: ['payment-status', pagoCospailId],
    queryFn: () => getPaymentStatus(pagoCospailId!),
    enabled: Boolean(pagoCospailId),
    refetchInterval: paymentStatusRefetchInterval,
  })
}
