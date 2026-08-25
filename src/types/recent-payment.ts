export interface RecentPaymentDebt {
  creditNumber: number
  period: string
  amount: number
}

export interface RecentPayment {
  pagoCospailId: string
  totalAmount: number
  debts: RecentPaymentDebt[]
}
