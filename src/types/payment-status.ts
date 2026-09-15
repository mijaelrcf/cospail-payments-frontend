// Estados del pago en Cospail (tabla PagoCospail).
// 0 = Pendiente, 1 = QR generado, 2/3 = Pagado, 4 = Anulado.
export const PagoCospailStatus = {
  Pendiente: 0,
  QrGenerado: 1,
  Pagado: 2,
  PagoConfirmado: 3,
  Anulado: 4,
} as const

export type PagoCospailStatus = (typeof PagoCospailStatus)[keyof typeof PagoCospailStatus]

export function isPaidStatus(status: number): boolean {
  return status === PagoCospailStatus.Pagado || status === PagoCospailStatus.PagoConfirmado
}

export function isAnnulledStatus(status: number): boolean {
  return status === PagoCospailStatus.Anulado
}

export function isPendingStatus(status: number): boolean {
  return status === PagoCospailStatus.Pendiente || status === PagoCospailStatus.QrGenerado
}
