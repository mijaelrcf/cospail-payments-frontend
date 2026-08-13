import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePaymentStore } from '../store/payment-store'

export function MenuPage() {
  const navigate = useNavigate()
  const { debtResponse, clearAll } = usePaymentStore()

  useEffect(() => {
    if (!debtResponse) {
      navigate('/', { replace: true })
    }
  }, [debtResponse, navigate])

  if (!debtResponse) return null

  const handleLogout = () => {
    clearAll()
    navigate('/')
  }

  const options = [
    {
      label: 'Pago QR',
      description: 'Generar un código QR para pagar tus deudas',
      onClick: () => navigate('/pago-qr'),
    },
    {
      label: 'Ver Pagos QR',
      description: 'Consultar los pagos QR realizados',
      onClick: () => navigate('/ver-pagos-qr'),
    },
    {
      label: 'Facturas Últimos 6 meses',
      description: 'Ver las facturas de los últimos 6 meses',
      onClick: () => navigate('/facturas'),
    },
    {
      label: 'Volver a página Principal',
      description: 'Salir de la sesión actual',
      onClick: handleLogout,
    },
  ]

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <h1 className="text-center text-3xl font-bold">Cospail Payments</h1>

      <div className="rounded-2xl bg-slate-100 p-4 text-center">
        <p className="font-semibold">{debtResponse.memberName}</p>
        <p className="text-sm text-slate-600">Código Fijo: {debtResponse.fixedCode}</p>
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.label}
            onClick={option.onClick}
            className="flex w-full items-center justify-between rounded-2xl bg-white p-4 text-left shadow transition hover:bg-slate-50"
          >
            <div>
              <p className="font-semibold">{option.label}</p>
              <p className="text-sm text-slate-500">{option.description}</p>
            </div>
            <span className="text-slate-400">→</span>
          </button>
        ))}
      </div>
    </div>
  )
}
