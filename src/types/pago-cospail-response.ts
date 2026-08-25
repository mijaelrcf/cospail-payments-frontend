export type PagoCospailStatus = 0 | 1 | 2 | 3 | 4

export type DeudaCospailStatus = 0 | 1 | 2

export interface PagoDebtResponse {
  creditNumber: number
  type: number
  noticeNumber: number
  year: number
  month: number
  period: string
  memberName: string | null
  amount: number
  status: DeudaCospailStatus
}

export interface PagoCospailResponse {
  pagoCospailId: string
  fixedCode: number
  documentId: string
  memberName: string | null
  totalAmount: number
  status: PagoCospailStatus
  createdAtUtc: string
  debts: PagoDebtResponse[]
}
