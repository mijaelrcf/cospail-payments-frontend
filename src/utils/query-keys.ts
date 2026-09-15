export const queryKeys = {
  activeQr: (fixedCode: number | null | undefined, documentId: string | null | undefined) =>
    ['active-qr', fixedCode, documentId] as const,
  activeQrRoot: ['active-qr'] as const,
  paymentStatus: (pagoCospailId: string | null | undefined) => ['payment-status', pagoCospailId] as const,
  recentPayments: (fixedCode: number | null | undefined) => ['recent-payments', fixedCode] as const,
  invoices: (fixedCode: number | null | undefined) => ['invoices-last-6-months', fixedCode] as const,
  invoicePdf: (creditNumber: number | null | undefined) => ['invoice-pdf', creditNumber] as const,
}
