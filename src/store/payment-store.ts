import { create } from 'zustand'
import type { DebtItem } from '../types/debt-item'
import type { QrResult } from '../types/qr-result'
import type { MemberDebtResponse } from '../types/member-debt-response'
import type { PagoCospailResponse } from '../types/pago-cospail-response'

interface PaymentState {
  debtResponse: MemberDebtResponse | null
  selectedDebts: DebtItem[]
  qrResult: QrResult | null
  fixedCode: number | null
  documentId: string | null
  initiatedPayment: PagoCospailResponse | null

  setDebtResponse: (value: MemberDebtResponse | null) => void
  setSelectedDebts: (value: DebtItem[]) => void
  setQrResult: (value: QrResult | null) => void
  setFixedCode: (value: number | null) => void
  setDocumentId: (value: string | null) => void
  setInitiatedPayment: (value: PagoCospailResponse | null) => void
  clearAll: () => void
}

export const usePaymentStore = create<PaymentState>((set) => ({
  debtResponse: null,
  selectedDebts: [],
  qrResult: null,
  fixedCode: null,
  documentId: null,
  initiatedPayment: null,

  setDebtResponse: (value) => set({ debtResponse: value }),
  setSelectedDebts: (value) => set({ selectedDebts: value }),
  setQrResult: (value) => set({ qrResult: value }),
  setFixedCode: (value) => set({ fixedCode: value }),
  setDocumentId: (value) => set({ documentId: value }),
  setInitiatedPayment: (value) => set({ initiatedPayment: value }),
  clearAll: () =>
    set({
      debtResponse: null,
      selectedDebts: [],
      qrResult: null,
      fixedCode: null,
      documentId: null,
      initiatedPayment: null,
    }),
}))
