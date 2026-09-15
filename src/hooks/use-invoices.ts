import { useQuery } from '@tanstack/react-query'
import { getInvoicePdf, getLast6MonthsInvoices } from '../api/payments'
import { queryKeys } from '../utils/query-keys'

export const useInvoices = (fixedCode: number | null | undefined) => {
  return useQuery({
    queryKey: queryKeys.invoices(fixedCode),
    queryFn: () => {
      if (!fixedCode) throw new Error('fixedCode es requerido')
      return getLast6MonthsInvoices(fixedCode)
    },
    enabled: Boolean(fixedCode),
  })
}

export const useInvoicePdf = (creditNumber: number | null | undefined) => {
  return useQuery({
    queryKey: queryKeys.invoicePdf(creditNumber),
    queryFn: () => {
      if (!creditNumber) throw new Error('creditNumber es requerido')
      return getInvoicePdf(creditNumber)
    },
    enabled: Boolean(creditNumber),
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  })
}
