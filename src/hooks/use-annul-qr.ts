import { useMutation } from '@tanstack/react-query'
import { annulQr } from '../api/payments'
import type { AnnulQrRequest } from '../api/payments'

export const useAnnulQr = () => {
  return useMutation({
    mutationFn: (request: AnnulQrRequest) => annulQr(request),
  })
}
