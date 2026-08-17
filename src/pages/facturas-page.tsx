import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/app-shell'
import { EmptyState } from '../components/empty-state'
import { ReceiptIcon } from '../components/icons'
import { usePaymentStore } from '../store/payment-store'

export function FacturasPage() {
  const navigate = useNavigate()
  const { debtResponse } = usePaymentStore()

  return (
    <AppShell memberName={debtResponse?.memberName} fixedCode={debtResponse?.fixedCode}>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cospail-navy/60">
          Documentos
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-cospail-ink">
          Facturas Últimos 6 meses
        </h1>
      </div>

      <EmptyState
        icon={ReceiptIcon}
        title="Disponible próximamente"
        description="Pronto podrás revisar y descargar las facturas de tus últimos 6 meses."
        onBack={() => navigate('/menu')}
      />
    </AppShell>
  )
}
