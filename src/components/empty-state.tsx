import type { ComponentType, SVGProps } from 'react'
import { BackButton } from './app-shell'

interface Props {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  description: string
  onBack: () => void
  backLabel?: string
  showBackButton?: boolean
}

export function EmptyState({ icon: Icon, title, description, onBack, backLabel, showBackButton = true }: Props) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-cospail-navy/20 bg-white/70 px-6 py-16 text-center shadow-sm">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cospail-sky-tint text-cospail-navy">
        <Icon className="h-7 w-7" />
      </span>
      <h2 className="mt-4 font-display text-xl font-semibold text-cospail-ink">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-cospail-ink/60">{description}</p>
      {showBackButton && <BackButton onClick={onBack} label={backLabel} className="mt-6" />}
    </div>
  )
}
