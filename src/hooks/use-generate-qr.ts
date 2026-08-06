import { useMutation } from '@tanstack/react-query'
import { generateQr } from '../api/payments'

export const useGenerateQr = () => {
  return useMutation({
    mutationFn: (request: {
      transactionId: string
      amount: number
      description: string
      dueDate: string
      selectedDebtIds: number[]
    }) => generateQr(request),
  })
}
