import { useQuery } from '@tanstack/react-query'
import { getInvoicePdf, getLast6MonthsInvoices } from '../api/payments'

export const useInvoices = (fixedCode: number | null | undefined) => {
  return useQuery({
    queryKey: ['invoices-last-6-months', fixedCode],
    queryFn: () => getLast6MonthsInvoices(fixedCode!),
    enabled: Boolean(fixedCode),
  })
}

export const useInvoicePdf = (creditNumber: number | null | undefined) => {
  return useQuery({
    queryKey: ['invoice-pdf', creditNumber],
    queryFn: () => getInvoicePdf(creditNumber!),
    enabled: Boolean(creditNumber),
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  })
}
