import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell, BackButton } from '../components/app-shell'
import { EmptyState } from '../components/empty-state'
import { HistoryIcon, InfoIcon } from '../components/icons'
import { PaymentCard } from '../components/payment-card'
import { PaymentDetailModal } from '../components/payment-detail-modal'
import { useRecentPayments } from '../hooks/use-recent-payments'
import { usePaymentStore } from '../store/payment-store'
import type { RecentPayment } from '../types/recent-payment'

export function VerPagosQrPage() {
  const navigate = useNavigate()
  const { debtResponse } = usePaymentStore()
  const recentPaymentsQuery = useRecentPayments(debtResponse?.fixedCode)
  const [selectedPayment, setSelectedPayment] = useState<RecentPayment | null>(null)

  useEffect(() => {
    if (!debtResponse) {
      navigate('/', { replace: true })
    }
  }, [debtResponse, navigate])

  if (!debtResponse) return null

  const payments = recentPaymentsQuery.data ?? []

  return (
    <AppShell memberName={debtResponse.memberName} fixedCode={debtResponse.fixedCode}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cospail-navy/60">
            Historial
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-cospail-ink">Ver Pagos QR</h1>
        </div>
        <BackButton onClick={() => navigate('/menu')} />
      </div>

      {recentPaymentsQuery.isLoading ? (
        <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-cospail-navy/5">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-cospail-sky border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-cospail-ink/60">
            Cargando pagos…
          </p>
        </div>
      ) : recentPaymentsQuery.isError ? (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <p className="text-sm font-medium text-red-700">
            No se pudieron cargar los pagos. Inténtalo nuevamente.
          </p>
        </div>
      ) : payments.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="Sin pagos registrados"
          description="Aún no has realizado ningún pago QR. Cuando generes uno, aparecerá aquí."
          onBack={() => navigate('/menu')}
        />
      ) : (
        <ul className="space-y-3">
          {payments.map((payment) => (
            <PaymentCard
              key={payment.pagoCospailId}
              payment={payment}
              onClick={() => setSelectedPayment(payment)}
            />
          ))}
        </ul>
      )}

      <PaymentDetailModal
        open={selectedPayment !== null}
        onClose={() => setSelectedPayment(null)}
        title="Detalle del Pago"
        totalAmount={selectedPayment?.totalAmount ?? 0}
        debts={selectedPayment?.debts ?? []}
      />
    </AppShell>
  )
}
