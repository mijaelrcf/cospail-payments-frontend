import { formatCurrency } from '../utils/format'
import { CheckIcon, XIcon } from './icons'
import { NavyButton } from './ui'

/**
 * Vistas puramente presentacionales de los estados finales del QR.
 * Sin polling, sin mutaciones, sin navegación: solo reciben
 * los datos y un único onExit. La lógica vive en cada card.
 */

export function PaidQrView({ amount, onExit }: { amount: number; onExit: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-cospail-green/30 bg-cospail-green-tint px-6 py-14 text-center shadow-sm">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cospail-green text-white shadow-md">
        <CheckIcon className="h-8 w-8" strokeWidth={2.5} />
      </span>
      <h2 className="mt-5 font-display text-2xl font-bold text-cospail-ink">
        ¡Pago recibido!
      </h2>
      <p className="mt-1 max-w-sm text-sm text-cospail-ink/60">
        Tu pago de <span className="font-semibold text-cospail-green-dark">{formatCurrency(amount)}</span> fue
        confirmado y está siendo registrado en Cospail.
      </p>
      <NavyButton onClick={onExit} className="mt-6">
        Volver al menú
      </NavyButton>
    </div>
  )
}

export function AnnulledQrView({ onExit }: { onExit: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-red-200 bg-red-50 px-6 py-14 text-center shadow-sm">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-md">
        <XIcon className="h-8 w-8" strokeWidth={2.5} />
      </span>
      <h2 className="mt-5 font-display text-2xl font-bold text-cospail-ink">
        QR anulado
      </h2>
      <p className="mt-1 max-w-sm text-sm text-cospail-ink/60">
        Este código QR fue anulado y ya no puede pagarse. Puedes iniciar un nuevo pago desde el menú.
      </p>
      <NavyButton onClick={onExit} className="mt-6">
        Volver al menú
      </NavyButton>
    </div>
  )
}
