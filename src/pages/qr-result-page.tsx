import { useNavigate } from 'react-router-dom'
import { AppShell, BackButton } from '../components/app-shell'
import { GeneratedQrCard } from '../components/generated-qr-card'
import { PageHeader } from '../components/ui'
import { useExitQrFlow } from '../hooks/use-exit-qr-flow'
import { useRefreshAfterPayment } from '../hooks/use-refresh-after-payment'
import { usePaymentStore } from '../store/payment-store'

export function QrResultPage() {
  const navigate = useNavigate()
  const qrResult = usePaymentStore((s) => s.qrResult)
  const initiatedPayment = usePaymentStore((s) => s.initiatedPayment)
  const debtResponse = usePaymentStore((s) => s.debtResponse)
  const refreshAfterPayment = useRefreshAfterPayment()
  const exitQrFlow = useExitQrFlow()

  const handlePaid = () => {
    void refreshAfterPayment(debtResponse?.fixedCode, debtResponse?.documentId)
  }

  if (!qrResult || !initiatedPayment) {
    navigate('/menu', { replace: true })
    return null
  }

  return (
    <AppShell memberName={debtResponse?.memberName} fixedCode={debtResponse?.fixedCode}>
      <PageHeader title="Código QR" action={<BackButton onClick={exitQrFlow} />} />

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cospail-navy/60">
          Paso 2 · Paga desde tu banco
        </p>
      </div>

      <GeneratedQrCard
        pagoCospailId={initiatedPayment.pagoCospailId}
        qrImage={qrResult.qrImage}
        amount={initiatedPayment.totalAmount}
        onPaid={handlePaid}
        onExit={exitQrFlow}
      />
    </AppShell>
  )
}
