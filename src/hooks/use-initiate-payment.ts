import { useMutation } from '@tanstack/react-query'
import { initiatePayment } from '../api/payments'
import type { InitiatePaymentRequest } from '../api/payments'

export const useInitiatePayment = () => {
  return useMutation({
    mutationFn: (request: InitiatePaymentRequest) => initiatePayment(request),
  })
}
