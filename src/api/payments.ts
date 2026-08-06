import { axiosClient } from './axios-client'
import type { MemberDebtResponse } from '../types/member-debt-response'
import type { QrResult } from '../types/qr-result'

export async function getMemberDebtByDocument(fixedCode: number, documentId: string): Promise<MemberDebtResponse> {
  const response = await axiosClient.get('/cospailsoap/member-debt-by-document', {
    params: { fixedCode, documentId },
  })
  return response.data
}

export async function generateQr(payload: {
  transactionId: string
  amount: number
  description: string
  dueDate: string
  selectedDebtIds: number[]
}): Promise<QrResult> {
  const response = await axiosClient.post('/BancoEconomico/generate-qr', payload)
  return response.data
}
