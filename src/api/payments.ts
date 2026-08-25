import { AxiosError } from 'axios'
import { axiosClient } from './axios-client'
import type { MemberDebtResponse } from '../types/member-debt-response'
import type { ActiveQrResponse } from '../types/active-qr-response'
import type { AnnulQrResponse } from '../types/annul-qr-response'
import type { PagoCospailResponse } from '../types/pago-cospail-response'
import type { QrResult } from '../types/qr-result'

export async function getMemberDebtByDocument(fixedCode: number, documentId: string): Promise<MemberDebtResponse> {
  const response = await axiosClient.get('/Cospail/member-debt-by-document', {
    params: { fixedCode, documentId },
  })
  return response.data
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const detail = (error.response?.data as { detail?: string } | undefined)?.detail
    if (detail) return detail
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

export async function generateQr(payload: GenerateQrRequest): Promise<QrResult> {
  const response = await axiosClient.post('/BancoEconomico/generate-qr', payload)
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
