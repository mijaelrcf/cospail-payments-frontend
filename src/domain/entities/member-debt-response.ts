import type { DebtItem } from './debt-item'

export type MemberDebtStatus =
  | 'withDebt'
  | 'withoutDebt'
  | 'notFound'
  | 'documentMismatch'

export interface MemberDebtResponse {
  status: MemberDebtStatus
  memberName: string
  debts: DebtItem[]
  message: string
}