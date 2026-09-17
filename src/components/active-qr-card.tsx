import { useEffect, useRef, useState } from 'react'
import { getApiErrorMessage } from '../api/payments'
import { useAnnulQr } from '../hooks/use-annul-qr'
import { usePaymentStatus } from '../hooks/use-payment-status'
import { isAnnulledStatus, isPaidStatus } from '../types/payment-status'
import { formatCurrency } from '../utils/format'
import { ClockIcon, XIcon } from './icons'
import { QrViewer } from './qr-viewer'
import { AnnulledQrView, PaidQrView } from './qr-status-views'
import { ErrorBox, FullscreenLoading } from './ui'

interface Props {
  pagoCospailId: string
  qrImage: string | null
  amount: number
  dueDate?: string
  /** Se llama al detectar el pago: refresca deudas y cachés. La card se queda mostrando el estado pagado. */
  onPaid: () => void
  /** Se llama al anular: refresca el QR activo. La card se queda mostrando el estado anulado. */
  onAnnulled: () => void
  /** Salida a /menu (botón superior de la página y estado pagado). */
  onGoMenu: () => void
}

/**
 * QR pendiente EXISTENTE (Paso 1, página Pago QR).
 * Flujo independiente: anular refresca, pagado refresca, salir va al menú.
 */
export function ActiveQrCard({ pagoCospailId, qrImage, amount, dueDate, onPaid, onAnnulled, onGoMenu }: Props) {
  const [confirmingAnnul, setConfirmingAnnul] = useState(false)
  const paymentStatusQuery = usePaymentStatus(pagoCospailId)
  const annulQrMutation = useAnnulQr()
  const paidNotifiedRef = useRef(false)

  const status = paymentStatusQuery.data?.status ?? 0
  const isPaid = isPaidStatus(status)
  const isAnnulled = isAnnulledStatus(status)

  useEffect(() => {
    paidNotifiedRef.current = false
  }, [pagoCospailId])

  useEffect(() => {
    if (isPaid && !paidNotifiedRef.current) {
      paidNotifiedRef.current = true
      onPaid()
    }
  }, [isPaid, onPaid])

  const handleAnnul = async () => {
    try {
      await annulQrMutation.mutateAsync({ pagoCospailId })
      setConfirmingAnnul(false)
      onAnnulled()
    } catch {
      // El error se muestra en pantalla con el detalle devuelto por la API.
    }
  }

  if (isPaid) {
    return <PaidQrView amount={amount} onExit={onGoMenu} />
  }

  if (isAnnulled) {
    return <AnnulledQrView onExit={onAnnulled} />
  }

  return (
    <>
      <div className="space-y-4">
        {qrImage ? (
          <QrViewer qrBase64={qrImage} />
        ) : (
          <div className="rounded-3xl bg-white p-8 text-center shadow-lg ring-1 ring-cospail-navy/5">
            <p className="text-sm text-cospail-ink/60">
              La imagen del QR no está disponible. Puedes anularlo y generar uno nuevo.
            </p>
          </div>
        )}

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-cospail-navy/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-cospail-ink/50">
                Monto a pagar
              </p>
              <p className="font-display text-2xl font-bold text-cospail-ink">{formatCurrency(amount)}</p>
            </div>
            {dueDate && (
              <div className="text-right">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-cospail-ink/50">
                  Vence
                </p>
                <p className="font-display text-sm font-semibold text-cospail-ink">{dueDate}</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-cospail-sky-tint px-4 py-3">
            <ClockIcon className="h-5 w-5 shrink-0 animate-pulse text-cospail-navy" />
            <p className="text-sm font-medium text-cospail-navy">
              Esperando tu pago… Esta pantalla se actualizará automáticamente.
            </p>
          </div>

          {!confirmingAnnul ? (
            <button
              type="button"
              onClick={() => setConfirmingAnnul(true)}
              disabled={annulQrMutation.isPending || paymentStatusQuery.isPending}
              className="mt-4 w-full rounded-xl border border-red-200 bg-white px-6 py-3 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200 disabled:opacity-50"
            >
              Anular QR pendiente
            </button>
          ) : (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">
                ¿Seguro que deseas anular este QR? Ya no podrá pagarse.
              </p>
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={handleAnnul}
                  disabled={annulQrMutation.isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200 disabled:opacity-50"
                >
                  <XIcon className="h-4 w-4" />
                  {annulQrMutation.isPending ? 'Anulando…' : 'Sí, anular'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingAnnul(false)}
                  disabled={annulQrMutation.isPending}
                  className="flex-1 rounded-xl border border-cospail-navy/15 bg-white px-4 py-2.5 text-sm font-semibold text-cospail-ink transition hover:bg-cospail-surface disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {annulQrMutation.isError && (
            <div className="mt-4">
              <ErrorBox
                message={getApiErrorMessage(annulQrMutation.error, 'No se pudo anular el QR. Inténtalo nuevamente.')}
              />
            </div>
          )}
        </div>
      </div>
      {annulQrMutation.isPending && <FullscreenLoading message="Anulando QR…" />}
    </>
  )
}
