import type { MemberDebtResponse } from '../entities/member-debt-response'
import type { QrResult } from '../entities/qr-result'

export interface GetMemberDebtRequest {
  fixedCode: number
  documentId: string
}

export interface GenerateQrRequest {
  transactionId: string
  amount: number
  description: string
  dueDate: string
  selectedDebtIds: number[]
}

export interface PaymentsRepository {
  getMemberDebtByDocument(
    request: GetMemberDebtRequest
  ): Promise<MemberDebtResponse>

  generateQr(request: GenerateQrRequest): Promise<QrResult>
}