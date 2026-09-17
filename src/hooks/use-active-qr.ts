import { useQuery } from '@tanstack/react-query'
import { getActiveQr } from '../api/payments'
import { queryKeys } from '../utils/query-keys'

export const activeQrQueryKey = queryKeys.activeQr

export const useActiveQr = (fixedCode: number | null | undefined, documentId: string | null | undefined) => {
  return useQuery({
    queryKey: queryKeys.activeQr(fixedCode, documentId),
    queryFn: () => {
      if (!fixedCode || !documentId) throw new Error('fixedCode y documentId son requeridos')
      return getActiveQr(fixedCode, documentId)
    },
    enabled: Boolean(fixedCode && documentId),
    // Nunca servir QR cacheado: un QR anulado/pagado no debe reaparecer
    // como fantasma al re-entrar. Siempre verifica fresco contra el backend.
    staleTime: 0,
  })
}
