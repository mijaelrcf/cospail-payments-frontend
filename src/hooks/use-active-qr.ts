import { useQuery } from '@tanstack/react-query'
import { getActiveQr } from '../api/payments'

export const activeQrQueryKey = (fixedCode: number, documentId: string) =>
  ['active-qr', fixedCode, documentId] as const

export const useActiveQr = (fixedCode: number | null | undefined, documentId: string | null | undefined) => {
  return useQuery({
    queryKey: ['active-qr', fixedCode, documentId],
    queryFn: () => getActiveQr(fixedCode!, documentId!),
    enabled: Boolean(fixedCode && documentId),
  })
}
