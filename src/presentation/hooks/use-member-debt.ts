import { useMutation } from '@tanstack/react-query'
import { PaymentsRepositoryImpl } from '../../infrastructure/repositories/payments-repository-impl'
import { GetMemberDebtUseCase } from '../../application/use-cases/get-member-debt.use-case'

const repository = new PaymentsRepositoryImpl()
const useCase = new GetMemberDebtUseCase(repository)

export const useMemberDebt = () => {
  return useMutation({
    mutationFn: (request: { fixedCode: number; documentId: string }) =>
      useCase.execute(request),
  })
}