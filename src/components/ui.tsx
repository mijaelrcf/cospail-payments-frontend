import type { ReactNode } from 'react'
import { InfoIcon } from './icons'

export function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-cospail-navy/5">
      <span className="h-8 w-8 animate-spin rounded-full border-4 border-cospail-sky border-t-transparent" />
      <p className="mt-4 text-sm font-medium text-cospail-ink/60">{message}</p>
    </div>
  )
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
      <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
      <p className="text-sm font-medium text-red-700">{message}</p>
    </div>
  )
}

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}

const baseButton =
  'rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-4 disabled:opacity-50'

export function NavyButton({ children, onClick, type = 'button', disabled, className = '' }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseButton} bg-cospail-navy text-white hover:bg-cospail-navy-dark focus-visible:ring-cospail-sky/40 ${className}`}
    >
      {children}
    </button>
  )
}

export function PageHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cospail-navy/60">{eyebrow}</p>
        )}
        <h1 className="mt-1 font-display text-xl font-bold text-cospail-ink">{title}</h1>
      </div>
      {action}
    </div>
  )
}
