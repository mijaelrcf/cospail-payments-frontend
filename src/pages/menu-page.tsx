import { useNavigate } from 'react-router-dom'
import { usePaymentStore } from '../store/payment-store'
import { useRequireAuth } from '../hooks/use-require-auth'
import { AppShell } from '../components/app-shell'
import { QrIcon, HistoryIcon, ReceiptIcon, LogoutIcon, ArrowRightIcon } from '../components/icons'
import type { ComponentType, SVGProps } from 'react'

interface MenuOption {
  label: string
  description: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  iconTone: string
  onClick: () => void
}

export function MenuPage() {
  const navigate = useNavigate()
  const debtResponse = useRequireAuth()
  const clearAll = usePaymentStore((s) => s.clearAll)

  if (!debtResponse) return null

  const handleLogout = () => {
    clearAll()
    navigate('/')
  }

  const options: MenuOption[] = [
    {
      label: 'Pago QR',
      description: 'Genera un código QR para pagar tus deudas',
      icon: QrIcon,
      iconTone: 'bg-cospail-sky-tint text-cospail-navy',
      onClick: () => navigate('/pago-qr'),
    },
    {
      label: 'Ver Pagos QR',
      description: 'Consulta los pagos QR realizados',
      icon: HistoryIcon,
      iconTone: 'bg-cospail-green-tint text-cospail-green-dark',
      onClick: () => navigate('/ver-pagos-qr'),
    },
    {
      label: 'Facturas Últimos 6 meses',
      description: 'Revisa las facturas de los últimos 6 meses',
      icon: ReceiptIcon,
      iconTone: 'bg-cospail-sky-tint text-cospail-navy-light',
      onClick: () => navigate('/facturas'),
    },
    {
      label: 'Salir',
      description: 'Cierra la sesión actual',
      icon: LogoutIcon,
      iconTone: 'bg-red-50 text-red-600',
      onClick: handleLogout,
    },
  ]

  return (
    <AppShell memberName={debtResponse.memberName} fixedCode={debtResponse.fixedCode}>
      <section className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cospail-navy/60">
          Menú de socio
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-cospail-ink">
          Hola, {debtResponse.memberName}
        </h1>
        <p className="mt-1 text-sm text-cospail-ink/60">
          ¿Qué deseas hacer hoy?
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={option.onClick}
            className="group flex items-center gap-4 rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-cospail-navy/5 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cospail-sky/30"
          >
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${option.iconTone}`}
            >
              <option.icon className="h-6 w-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display font-semibold text-cospail-ink">
                {option.label}
              </span>
              <span className="mt-0.5 block text-sm text-cospail-ink/60">
                {option.description}
              </span>
            </span>
            <ArrowRightIcon className="h-5 w-5 shrink-0 text-cospail-navy/25 transition group-hover:translate-x-1 group-hover:text-cospail-sky" />
          </button>
        ))}
      </div>
    </AppShell>
  )
}
