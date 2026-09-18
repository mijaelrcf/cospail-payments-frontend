export interface RecentPaymentDebt {
  creditNumber: number
  period: string
  amount: number
}

export interface RecentPayment {
  pagoCospailId: string
  totalAmount: number
  /** Fecha/hora UTC en que el banco notificó el pago. Null si aún no fue notificado. */
  paidAtUtc: string | null
  debts: RecentPaymentDebt[]
}
