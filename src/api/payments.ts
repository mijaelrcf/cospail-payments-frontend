import { AxiosError } from 'axios'
import { axiosClient } from './axios-client'
import type { MemberDebtResponse } from '../types/member-debt-response'
import type { ActiveQrResponse } from '../types/active-qr-response'
import type { AnnulQrResponse } from '../types/annul-qr-response'
import type { PagoCospailResponse } from '../types/pago-cospail-response'
import type { RecentPayment } from '../types/recent-payment'
import type { QrResult } from '../types/qr-result'
import type { InvoicePdf, InvoiceSummary } from '../types/invoice'

export async function getMemberDebtByDocument(fixedCode: number, documentId: string): Promise<MemberDebtResponse> {
  const response = await axiosClient.get('/Cospail/member-debt-by-document', {
    params: { fixedCode, documentId },
  })
  return response.data
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status
    const data = error.response?.data as
      | { detail?: string | null; message?: string | null; title?: string | null }
      | undefined

    const rawMessage = data?.detail ?? data?.message ?? data?.title

    // El backend a veces devuelve mensajes técnicos/genéricos en inglés
    // (ej. "An unexpected error ocurred." o Message: null cuando el banco falla).
    // En esos casos mostramos el fallback amigable en español.
    if (rawMessage) {
      const normalized = rawMessage.trim().toLowerCase()
      const isTechnical = [
        'an unexpected error',
        'unexpected error',
        'ocurred',
        'occurred',
        'internal server error',
        'server error',
      ].some((fragment) => normalized.includes(fragment))

      // Mensaje nulo literal del backend (Message: null) también es técnico.
      const isNullLiteral = normalized === 'null'

      if (!isTechnical && !isNullLiteral) return rawMessage.trim()
    }

    // Error de red (sin respuesta) o error 5xx: mensaje amigable.
    if (!error.response || (status !== undefined && status >= 500)) {
      return fallback
    }

    if (rawMessage?.trim()) return rawMessage.trim()
  }
  return fallback
}

export interface InitiatePaymentDebt {
  creditNumber: number
  type: number
  amount: number
}

export interface InitiatePaymentRequest {
  fixedCode: number
  documentId: string
  debts: InitiatePaymentDebt[]
}

export async function initiatePayment(payload: InitiatePaymentRequest): Promise<PagoCospailResponse> {
  const response = await axiosClient.post('/Cospail/payments/initiate', payload)
  return response.data
}

export interface GenerateQrRequest {
  pagoCospailId: string
  branchCode?: string
}

// Canal de origen del QR. Valor fijo: el frontend siempre envía 'web'.
export const DEFAULT_BRANCH_CODE = 'web'

export async function generateQr(payload: GenerateQrRequest): Promise<QrResult> {
  const response = await axiosClient.post('/BancoEconomico/generate-qr', {
    ...payload,
    branchCode: payload.branchCode ?? DEFAULT_BRANCH_CODE,
  })
  return response.data
}

export async function getActiveQr(fixedCode: number, documentId: string): Promise<ActiveQrResponse | null> {
  try {
    const response = await axiosClient.get('/Cospail/payments/active-qr', {
      params: { fixedCode, documentId },
    })
    return response.data
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null
    }
    throw error
  }
}

export interface AnnulQrRequest {
  pagoCospailId: string
}

export async function annulQr(payload: AnnulQrRequest): Promise<AnnulQrResponse> {
  const response = await axiosClient.post('/BancoEconomico/annul-qr', payload)
  return response.data
}

export async function getPaymentStatus(pagoCospailId: string): Promise<PagoCospailResponse> {
  const response = await axiosClient.get(`/Cospail/payments/${pagoCospailId}`)
  return response.data
}

export async function getRecentPayments(fixedCode: number, status?: string): Promise<RecentPayment[]> {
  const response = await axiosClient.get('/Cospail/payments/recent', {
    params: status === undefined ? { fixedCode } : { fixedCode, status },
  })
  return response.data
}

export async function getLast6MonthsInvoices(fixedCode: number): Promise<InvoiceSummary[]> {
  const response = await axiosClient.get('/Cospail/invoices/last-6-months', {
    params: { fixedCode },
  })
  return response.data
}

// creditNumber es el IDCredito del reporte (se envía como NCredito al SOAP).
export async function getInvoicePdf(creditNumber: number): Promise<InvoicePdf> {
  const response = await axiosClient.get(`/Cospail/invoices/${creditNumber}/pdf`)
  return response.data
}
