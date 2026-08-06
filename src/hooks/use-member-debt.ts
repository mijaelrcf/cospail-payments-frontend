import { useMutation } from '@tanstack/react-query'
import { getMemberDebtByDocument } from '../api/payments'

export const useMemberDebt = () => {
  return useMutation({
    mutationFn: ({ fixedCode, documentId }: { fixedCode: number; documentId: string }) =>
      getMemberDebtByDocument(fixedCode, documentId),
  })
}
