import { useMutation } from '@tanstack/react-query'
import { PaymentsRepositoryImpl } from '../../infrastructure/repositories/payments-repository-impl'
import { GenerateQrUseCase } from '../../application/use-cases/generate-qr.use-case'

const repository = new PaymentsRepositoryImpl()
const useCase = new GenerateQrUseCase(repository)

export const useGenerateQr = () => {
  return useMutation({
    mutationFn: (request: {
      transactionId: string
      amount: number
      description: string
      dueDate: string
      selectedDebtIds: number[]
    }) => useCase.execute(request),
  })
}