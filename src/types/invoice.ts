// Campos reales de ObtenerCobrosFecha:
// codCobrador, IDCredito (-> creditNumber), FechaPago+HoraPago (-> chargeDate),
// CodigoFijo (-> fixedCode), Nombre (-> memberName), Importe (-> amount).
// creditNumber es el IDCredito y se envía como NCredito para el PDF.
export interface InvoiceSummary {
  creditNumber: number
  chargeDate: string | null
  paymentTime: string
  amount: number
  memberName: string
  collectorCode: number
  fixedCode: number
}

export interface InvoicePdf {
  creditNumber: number
  fileName: string
  contentType: string
  pdfBase64: string
}
