export type PagoQrStatus = 0 | 1 | 2

export interface ActiveQrResponse {
  pagoCospailId: string
  qrId: string
  qrImage: string | null
  amount: number
  currency: string
  dueDate: string
  status: PagoQrStatus
  createdAtUtc: string
}
