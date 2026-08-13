import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { QrViewer } from '../components/qr-viewer'
import { usePaymentStore } from '../store/payment-store'

export function QrResultPage() {
  const navigate = useNavigate()
  const { qrResult, initiatedPayment } = usePaymentStore()

  useEffect(() => {
    if (!qrResult) {
      navigate('/menu', { replace: true })
    }
  }, [qrResult, navigate])

  if (!qrResult) return null

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Código QR</h1>
        <button
          onClick={() => navigate('/menu')}
          className="rounded-xl border border-slate-300 px-4 py-2 text-slate-600"
        >
          Volver al menú
        </button>
      </div>

      {initiatedPayment && (
        <div className="rounded-2xl bg-slate-100 p-4 text-center">
          <p className="font-semibold">
            Pago por: Bs {initiatedPayment.totalAmount.toFixed(2)}
          </p>
          <p className="text-sm text-slate-500">
            Escanea el código QR desde tu aplicación bancaria para pagar.
          </p>
        </div>
      )}

      <QrViewer qrBase64={qrResult.qrImage} />
    </div>
  )
}
