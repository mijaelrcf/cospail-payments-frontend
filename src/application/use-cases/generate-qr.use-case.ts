import type {
  GenerateQrRequest,
  PaymentsRepository,
} from '../../domain/repositories/payments-repository'

export class GenerateQrUseCase {
  private readonly repository: PaymentsRepository

  constructor(repository: PaymentsRepository) {
    this.repository = repository
  }

  async execute(request: GenerateQrRequest) {
    return await this.repository.generateQr(request)
  }
}