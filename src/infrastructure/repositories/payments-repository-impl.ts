import type {
  GenerateQrRequest,
  GetMemberDebtRequest,
  PaymentsRepository,
} from '../../domain/repositories/payments-repository'
import type { MemberDebtResponse } from '../../domain/entities/member-debt-response'
import type { QrResult } from '../../domain/entities/qr-result'
import { paymentsApi } from '../api/payments-api'

export class PaymentsRepositoryImpl implements PaymentsRepository {
  async getMemberDebtByDocument(
    request: GetMemberDebtRequest
  ): Promise<MemberDebtResponse> {
    return await paymentsApi.getMemberDebtByDocument(
      request.fixedCode,
      request.documentId
    )
  }

  async generateQr(request: GenerateQrRequest): Promise<QrResult> {
    return await paymentsApi.generateQr(request)
  }
}