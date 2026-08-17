import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell, BackButton } from '../components/app-shell'
import { QrViewer } from '../components/qr-viewer'
import { usePaymentStore } from '../store/payment-store'

export function QrResultPage() {
  const navigate = useNavigate()
  const { qrResult, initiatedPayment, debtResponse } = usePaymentStore()

  useEffect(() => {
    if (!qrResult) {
      navigate('/menu', { replace: true })
    }
  }, [qrResult, navigate])

  if (!qrResult) return null

  return (
    <AppShell memberName={debtResponse?.memberName} fixedCode={debtResponse?.fixedCode}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="mt-1 font-display text-xl font-bold text-cospail-ink">Código QR</h1>
        </div>
        <BackButton onClick={() => navigate('/menu')} />
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cospail-navy/60">
            Paso 2 · Paga desde tu banco
          </p>
        </div>
      </div>

      {initiatedPayment && (
        <div className="mb-6 rounded-2xl border border-cospail-green/40 bg-cospail-green-tint p-5 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cospail-green-dark">
            QR registrado
          </p>
          <p className="mt-1 font-display text-3xl font-bold text-cospail-ink">
            Bs {initiatedPayment.totalAmount.toFixed(2)}
          </p>
        </div>
      )}

      <QrViewer qrBase64={qrResult.qrImage} />
    </AppShell>
  )
}
