import { useEffect, useRef } from 'react'
import type { RecentPaymentDebt } from '../types/recent-payment'
import { formatCurrency } from '../utils/format'
import { XIcon } from './icons'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  totalAmount: number
  debts: RecentPaymentDebt[]
}

export function PaymentDetailModal({ open, onClose, title, totalAmount, debts }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      if (!dialog.open) dialog.showModal()
    } else if (dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto w-full max-w-lg rounded-3xl bg-white p-0 shadow-xl ring-1 ring-cospail-navy/10 backdrop:bg-cospail-ink/40 backdrop:backdrop-blur-sm sm:p-6"
    >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-cospail-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-8 w-8 items-center justify-center rounded-full text-cospail-ink/40 transition hover:bg-cospail-surface hover:text-cospail-ink"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-5 rounded-2xl bg-cospail-surface p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cospail-ink/50">
            Monto total
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-cospail-navy">
            {formatCurrency(totalAmount)}
          </p>
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-cospail-navy/60">
          Deudas incluidas ({debts.length})
        </p>

        {debts.length === 0 ? (
          <p className="text-sm text-cospail-ink/60">Este pago no tiene deudas asociadas.</p>
        ) : (
        <ul className="max-h-60 space-y-2 overflow-y-auto">
          {debts.map((item) => (
            <li
              key={item.creditNumber}
              className="flex items-center justify-between gap-4 rounded-xl border border-cospail-navy/10 bg-white p-3"
            >
              <span>
                <span className="block text-sm font-semibold text-cospail-ink">{item.period}</span>
                <span className="block text-xs text-cospail-ink/60">
                  Crédito{' '}
                  <span className="font-mono font-medium text-cospail-navy">
                    {item.creditNumber}
                  </span>
                </span>
              </span>
              <span className="shrink-0 font-display text-base font-bold text-cospail-navy">
                {formatCurrency(item.amount)}
              </span>
            </li>
          ))}
        </ul>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-cospail-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cospail-navy-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cospail-sky/40"
          >
            Cerrar
          </button>
        </div>
    </dialog>
  )
}
