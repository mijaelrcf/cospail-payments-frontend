import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell, BackButton } from '../components/app-shell'
import { EmptyState } from '../components/empty-state'
import { HistoryIcon } from '../components/icons'
import { PaymentDetailModal } from '../components/payment-detail-modal'
import { ErrorBox, LoadingState } from '../components/ui'
import { useRecentPayments } from '../hooks/use-recent-payments'
import { useRequireAuth } from '../hooks/use-require-auth'
import { formatCurrency, formatPaymentDate } from '../utils/format'
import type { RecentPayment } from '../types/recent-payment'

export function VerPagosQrPage() {
  const navigate = useNavigate()
  const debtResponse = useRequireAuth()
  const recentPaymentsQuery = useRecentPayments(debtResponse?.fixedCode)
  const [selectedPayment, setSelectedPayment] = useState<RecentPayment | null>(null)

  // El backend ya ordena por fecha de pago desc; se re-ordena por
  // seguridad dejando sin fecha al final.
  const payments = useMemo(() => {
    const list = [...(recentPaymentsQuery.data ?? [])]
    list.sort((a, b) => {
      const timeA = a.paidAtUtc ? new Date(a.paidAtUtc).getTime() : Number.NEGATIVE_INFINITY
      const timeB = b.paidAtUtc ? new Date(b.paidAtUtc).getTime() : Number.NEGATIVE_INFINITY
      return timeB - timeA
    })
    return list
  }, [recentPaymentsQuery.data])

  if (!debtResponse) return null

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
          showBackButton={false}
        />
      ) : (
        <div className="overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-cospail-navy/5">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-cospail-navy/10 text-xs font-semibold uppercase tracking-[0.12em] text-cospail-navy/60">
                <th scope="col" className="px-5 py-4">
                  Fecha de Pago
                </th>
                <th scope="col" className="px-5 py-4 text-right">
                  Monto
                </th>
                <th scope="col" className="px-5 py-4 text-right">
                  Detalle
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.pagoCospailId}
                  className="border-b border-cospail-navy/5 transition last:border-0 hover:bg-cospail-sky-tint/40"
                >
                  <td className="px-5 py-4 font-semibold text-cospail-ink">
                    {formatPaymentDate(payment.paidAtUtc)}
                  </td>
                  <td className="px-5 py-4 text-right font-display font-bold text-cospail-navy">
                    {formatCurrency(payment.totalAmount)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedPayment(payment)}
                      className="rounded font-semibold text-cospail-sky underline decoration-cospail-sky/40 underline-offset-4 transition hover:text-cospail-navy hover:decoration-cospail-navy focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cospail-sky/30"
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
