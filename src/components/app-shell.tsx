import type { ReactNode } from 'react'
import { DropletLogo } from './droplet-logo'
import { Wave } from './wave'
import { ArrowLeftIcon } from './icons'

interface AppShellProps {
  children: ReactNode
  memberName?: string | null
  fixedCode?: number | null
}

export function AppShell({ children, memberName, fixedCode }: AppShellProps) {
  return (
    <div className="min-h-screen bg-cospail-surface">
      <header className="relative overflow-hidden bg-linear-to-br from-cospail-navy-dark via-cospail-navy to-cospail-navy-light">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cospail-sky/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -left-24 h-64 w-64 rounded-full bg-cospail-green/10 blur-3xl"
        />

        <div className="relative mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-6 pt-6 pb-9 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
              <DropletLogo className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-display text-lg font-semibold leading-tight text-white">
                Cospail
              </span>
              <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-cospail-sky">
                Cooperativa de Agua · R.L.
              </span>
            </span>
          </div>

          {memberName && (
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2 ring-1 ring-white/15 backdrop-blur">
              <span className="text-right">
                <span className="block text-sm font-medium leading-tight text-white">
                  {memberName}
                </span>
                <span className="block font-mono text-xs text-cospail-sky">
                  Código #{fixedCode}
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="relative h-7 overflow-hidden sm:h-9">
          <Wave className="absolute inset-x-0 bottom-0 h-7 w-full text-cospail-surface sm:h-9" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-8 sm:px-8">{children}</main>
    </div>
  )
}

interface BackButtonProps {
  onClick: () => void
  label?: string
  className?: string
}

export function BackButton({ onClick, label = 'Volver al menú', className }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl border border-cospail-navy/15 bg-white px-4 py-2 text-sm font-medium text-cospail-navy shadow-sm transition hover:border-cospail-sky hover:bg-cospail-sky-tint focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cospail-sky/30 ${className ?? ''}`}
    >
      <ArrowLeftIcon className="h-4 w-4" />
      {label}
    </button>
  )
}
