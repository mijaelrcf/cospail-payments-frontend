import { ArrowRightIcon } from './icons'
import type { RecentPayment } from '../types/recent-payment'

interface Props {
  payment: RecentPayment
  onClick: () => void
}

export function PaymentCard({ payment, onClick }: Props) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border border-cospail-navy/10 bg-white p-4 shadow-sm transition hover:border-cospail-sky/70 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cospail-sky/25"
      >
        <span className="flex items-center gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cospail-sky-tint text-cospail-navy">
            <svg
              viewBox="0 0 24 24"
              width={20}
              height={20}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
              <path d="M14 8H8" />
              <path d="M16 12H8" />
              <path d="M13 16H8" />
            </svg>
          </span>
          <span className="text-left">
            <span className="block font-semibold text-cospail-ink">Pago QR</span>
            <span className="block text-xs text-cospail-sky font-medium">
              Ver detalle
            </span>
          </span>
        </span>
        <span className="flex items-center gap-3">
          <span className="text-right">
            <span className="block font-display text-lg font-bold text-cospail-navy">
              Bs {payment.totalAmount.toFixed(2)}
            </span>
          </span>
          <ArrowRightIcon className="h-5 w-5 text-cospail-ink/30 transition group-hover:text-cospail-sky" />
        </span>
      </button>
    </li>
  )
}
