import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/app-shell'
import { EmptyState } from '../components/empty-state'
import { HistoryIcon } from '../components/icons'
import { usePaymentStore } from '../store/payment-store'

export function VerPagosQrPage() {
  const navigate = useNavigate()
  const { debtResponse } = usePaymentStore()

  return (
    <AppShell memberName={debtResponse?.memberName} fixedCode={debtResponse?.fixedCode}>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cospail-navy/60">
          Historial
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-cospail-ink">Ver Pagos QR</h1>
      </div>

      <EmptyState
        icon={HistoryIcon}
        title="Disponible próximamente"
        description="Pronto podrás consultar aquí todos los pagos QR que realices."
        onBack={() => navigate('/menu')}
      />
    </AppShell>
  )
}
