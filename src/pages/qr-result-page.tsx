import { useNavigate } from 'react-router-dom'
import { AppShell, BackButton } from '../components/app-shell'
import { PendingQrCard } from '../components/pending-qr-card'
import { PageHeader } from '../components/ui'
import { useRefreshAfterPayment } from '../hooks/use-refresh-after-payment'
import { usePaymentStore } from '../store/payment-store'

export function QrResultPage() {
  const navigate = useNavigate()
  const qrResult = usePaymentStore((s) => s.qrResult)
  const initiatedPayment = usePaymentStore((s) => s.initiatedPayment)
  const debtResponse = usePaymentStore((s) => s.debtResponse)
  const setInitiatedPayment = usePaymentStore((s) => s.setInitiatedPayment)
  const refreshAfterPayment = useRefreshAfterPayment()

  const handleAnnulled = () => {
    setInitiatedPayment(null)
    navigate('/menu', { replace: true })
  }

  const handleGoMenu = () => {
    navigate('/menu', { replace: true })
  }

  const handlePaid = () => {
    void refreshAfterPayment(debtResponse?.fixedCode, debtResponse?.documentId)
  }

  if (!qrResult || !initiatedPayment) {
    navigate('/menu', { replace: true })
    return null
  }

  return (
    <AppShell memberName={debtResponse?.memberName} fixedCode={debtResponse?.fixedCode}>
      <PageHeader title="Código QR" action={<BackButton onClick={handleGoMenu} />} />

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
        onPaid={handlePaid}
        onGoMenu={handleGoMenu}
      />
    </AppShell>
  )
}
