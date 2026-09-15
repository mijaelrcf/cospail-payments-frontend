import { ArrowLeftIcon } from './icons'

interface BackButtonProps {
  onClick: () => void
  label?: string
  className?: string
}

export function BackButton({ onClick, label = 'Volver al menú', className = '' }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl border border-cospail-navy/15 bg-white px-4 py-2 text-sm font-medium text-cospail-navy shadow-sm transition hover:border-cospail-sky hover:bg-cospail-sky-tint focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cospail-sky/30 ${className}`.trim()}
    >
      <ArrowLeftIcon className="h-4 w-4" />
      {label}
    </button>
  )
}
