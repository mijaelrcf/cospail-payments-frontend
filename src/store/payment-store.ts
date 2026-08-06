import { create } from 'zustand'
import type { DebtItem } from '../types/debt-item'
import type { QrResult } from '../types/qr-result'
import type { MemberDebtResponse } from '../types/member-debt-response'

interface PaymentState {
  debtResponse: MemberDebtResponse | null
  selectedDebts: DebtItem[]
  qrResult: QrResult | null

  setDebtResponse: (value: MemberDebtResponse | null) => void
  setSelectedDebts: (value: DebtItem[]) => void
  setQrResult: (value: QrResult | null) => void
  clearAll: () => void
}

export const usePaymentStore = create<PaymentState>((set) => ({
  debtResponse: null,
  selectedDebts: [],
  qrResult: null,

  setDebtResponse: (value) => set({ debtResponse: value }),
  setSelectedDebts: (value) => set({ selectedDebts: value }),
  setQrResult: (value) => set({ qrResult: value }),
  clearAll: () =>
    set({
      debtResponse: null,
      selectedDebts: [],
      qrResult: null,
    }),
}))
