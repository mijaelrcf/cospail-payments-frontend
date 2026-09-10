import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { AppShell, BackButton } from '../components/app-shell'
import { PendingQrCard } from '../components/pending-qr-card'
import { getMemberDebtByDocument } from '../api/payments'
import { usePaymentStore } from '../store/payment-store'

export function QrResultPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { qrResult, initiatedPayment, debtResponse, setDebtResponse, setSelectedDebts, setInitiatedPayment } =
    usePaymentStore()

  useEffect(() => {
    if (!qrResult || !initiatedPayment) {
      navigate('/menu', { replace: true })
    }
  }, [qrResult, initiatedPayment, navigate])

  if (!qrResult || !initiatedPayment) return null

  const handleAnnulled = () => {
    setInitiatedPayment(null)
    navigate('/menu', { replace: true })
  }

  const handleGoMenu = () => {
    navigate('/menu', { replace: true })
  }

  const handlePaid = () => {
    setSelectedDebts([])

    const fixedCode = debtResponse?.fixedCode
    const documentId = debtResponse?.documentId
    if (!fixedCode || !documentId) return

    void (async () => {
      try {
        const fresh = await getMemberDebtByDocument(fixedCode, documentId)
        setDebtResponse(fresh)
        setSelectedDebts([])
      } catch {
        // Si el refetch falla, igual se limpió la selección; la próxima
        // entrada a Pago QR mostrará el último estado conocido.
      } finally {
        void queryClient.invalidateQueries({ queryKey: ['active-qr'] })
        void queryClient.invalidateQueries({ queryKey: ['recent-payments'] })
        void queryClient.invalidateQueries({ queryKey: ['invoices-last-6-months'] })
      }
    })()
  }

  return (
    <AppShell memberName={debtResponse?.memberName} fixedCode={debtResponse?.fixedCode}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="mt-1 font-display text-xl font-bold text-cospail-ink">Código QR</h1>
        </div>
        <BackButton onClick={handleGoMenu} />
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
        onPaid={handlePaid}
        onGoMenu={handleGoMenu}
      />
    </AppShell>
  )
}
