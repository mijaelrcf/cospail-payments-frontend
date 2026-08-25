import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell, BackButton } from '../components/app-shell'
import { PendingQrCard } from '../components/pending-qr-card'
import { usePaymentStore } from '../store/payment-store'

export function QrResultPage() {
  const navigate = useNavigate()
  const { qrResult, initiatedPayment, debtResponse, setInitiatedPayment } = usePaymentStore()

  useEffect(() => {
    if (!qrResult || !initiatedPayment) {
      navigate('/menu', { replace: true })
    }
  }, [qrResult, initiatedPayment, navigate])

  if (!qrResult || !initiatedPayment) return null

  const handleAnnulled = () => {
    setInitiatedPayment(null)
    navigate('/menu')
  }

  return (
    <AppShell memberName={debtResponse?.memberName} fixedCode={debtResponse?.fixedCode}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="mt-1 font-display text-xl font-bold text-cospail-ink">Código QR</h1>
        </div>
        <BackButton onClick={() => navigate('/menu')} />
      </div>

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cospail-navy/60">
          Paso 2 · Paga desde tu banco
        </p>
      </div>

      <PendingQrCard
        pagoCospailId={initiatedPayment.pagoCospailId}
        qrImage={qrResult.qrImage}
        amount={initiatedPayment.totalAmount}
        onAnnulled={handleAnnulled}
      />
    </AppShell>
  )
}
