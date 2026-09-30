import { ClockIcon } from './icons'

function AnimatedDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-cospail-navy"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}

/**
 * Indicador de espera activa del pago: puntitos animados + barra
 * skeleton que simula la consulta periódica al banco.
 * Presentacional, sin lógica de polling.
 */
export function PaymentWaitIndicator() {
  return (
    <div className="mt-4 rounded-xl bg-cospail-sky-tint px-4 py-3">
      <div className="flex items-center gap-2.5">
        <ClockIcon className="h-5 w-5 shrink-0 text-cospail-navy" />
        <p className="flex items-center gap-2 text-sm font-medium text-cospail-navy">
          Esperando tu pago
          <AnimatedDots />
        </p>
      </div>
      <p className="animate-shimmer mt-1 pl-[30px] text-xs font-medium">
        Consultando al banco, esta pantalla se actualizará automáticamente.
      </p>
    </div>
  )
}
