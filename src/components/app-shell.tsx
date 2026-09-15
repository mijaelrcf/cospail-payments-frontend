import type { ReactNode } from 'react'
import { BrandHeader } from './brand-header'
import { Wave } from './wave'

export { BackButton } from './back-button'

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
          <BrandHeader />

          {memberName && (
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2 ring-1 ring-white/15 backdrop-blur">
              <span className="text-right">
                <span className="block text-sm font-medium leading-tight text-white">
                  {memberName}
                </span>
                {fixedCode != null && (
                  <span className="block font-mono text-xs text-cospail-sky">
                    Código #{fixedCode}
                  </span>
                )}
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
