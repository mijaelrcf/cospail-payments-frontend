import type { DebtItem } from './debt-item'

export const MemberDebtStatus = {
  HasDebt: 0,
  NoDebt: 1,
  DocumentMismatch: 2,
  MemberNotFound: 3,
} as const

export type MemberDebtStatus = (typeof MemberDebtStatus)[keyof typeof MemberDebtStatus]

export interface MemberDebtResponse {
  fixedCode: number
  documentId: string
  memberName: string | null
  status: MemberDebtStatus
  debts: DebtItem[]
}
