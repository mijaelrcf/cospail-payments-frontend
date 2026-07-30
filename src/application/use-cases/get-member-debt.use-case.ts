import type {
  GetMemberDebtRequest,
  PaymentsRepository,
} from '../../domain/repositories/payments-repository'

export class GetMemberDebtUseCase {
  private readonly repository: PaymentsRepository

  constructor(repository: PaymentsRepository) {
    this.repository = repository
  }

  async execute(request: GetMemberDebtRequest) {
    return await this.repository.getMemberDebtByDocument(request)
  }
}