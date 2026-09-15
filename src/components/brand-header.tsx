import { DropletLogo } from './droplet-logo'

export function BrandHeader() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
        <DropletLogo className="h-6 w-6" />
      </span>
      <span>
        <span className="block font-display text-lg font-semibold leading-tight text-white">Cospail</span>
        <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-cospail-sky">
          Cooperativa de Agua · R.L.
        </span>
      </span>
    </div>
  )
}
