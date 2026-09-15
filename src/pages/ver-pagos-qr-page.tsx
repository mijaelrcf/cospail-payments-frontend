import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell, BackButton } from '../components/app-shell'
import { EmptyState } from '../components/empty-state'
import { HistoryIcon } from '../components/icons'
import { PaymentCard } from '../components/payment-card'
import { PaymentDetailModal } from '../components/payment-detail-modal'
import { ErrorBox, LoadingState } from '../components/ui'
import { useRecentPayments } from '../hooks/use-recent-payments'
import { useRequireAuth } from '../hooks/use-require-auth'
import type { RecentPayment } from '../types/recent-payment'

export function VerPagosQrPage() {
  const navigate = useNavigate()
  const debtResponse = useRequireAuth()
  const recentPaymentsQuery = useRecentPayments(debtResponse?.fixedCode)
  const [selectedPayment, setSelectedPayment] = useState<RecentPayment | null>(null)

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
        <LoadingState message="Cargando pagos…" />
      ) : recentPaymentsQuery.isError ? (
        <ErrorBox message="No se pudieron cargar los pagos. Inténtalo nuevamente." />
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
