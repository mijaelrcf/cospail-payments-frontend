import { axiosClient } from './axios-client'
import type { MemberDebtResponse } from '../types/member-debt-response'
import type { PagoCospailResponse } from '../types/pago-cospail-response'
import type { QrResult } from '../types/qr-result'

export async function getMemberDebtByDocument(fixedCode: number, documentId: string): Promise<MemberDebtResponse> {
  const response = await axiosClient.get('/Cospail/member-debt-by-document', {
    params: { fixedCode, documentId },
  })
  return response.data
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
  transactionId: string
  pagoCospailId: string
  currency: string
  dueDate: string
  description: string
}

export async function generateQr(payload: GenerateQrRequest): Promise<QrResult> {
  const response = await axiosClient.post('/BancoEconomico/generate-qr', payload)
  return response.data
}
