import { useMutation } from '@tanstack/react-query'
import { generateQr } from '../api/payments'
import type { GenerateQrRequest } from '../api/payments'

export const useGenerateQr = () => {
  return useMutation({
    mutationFn: (request: GenerateQrRequest) => generateQr(request),
  })
}
