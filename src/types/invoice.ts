export interface InvoiceSummary {
  creditNumber: number
  noticeNumber: number
  period: string
  chargeDate: string | null
  amount: number
  memberName: string
  invoiceNumber: string
}

export interface InvoicePdf {
  creditNumber: number
  fileName: string
  contentType: string
  pdfBase64: string
}
