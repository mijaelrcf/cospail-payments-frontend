import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell, BackButton } from '../components/app-shell'
import { EmptyState } from '../components/empty-state'
import { ArrowRightIcon, InfoIcon, ReceiptIcon } from '../components/icons'
import { InvoiceViewerModal } from '../components/invoice-viewer-modal'
import { useInvoices } from '../hooks/use-invoices'
import { usePaymentStore } from '../store/payment-store'
import type { InvoiceSummary } from '../types/invoice'

function formatChargeDate(value: string | null): string {
  if (!value) return 'Fecha no disponible'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function FacturasPage() {
  const navigate = useNavigate()
  const { debtResponse } = usePaymentStore()
  const invoicesQuery = useInvoices(debtResponse?.fixedCode)
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceSummary | null>(null)

  useEffect(() => {
    if (!debtResponse) {
      navigate('/', { replace: true })
    }
  }, [debtResponse, navigate])

  if (!debtResponse) return null

  const invoices = invoicesQuery.data ?? []

  return (
    <AppShell memberName={debtResponse.memberName} fixedCode={debtResponse.fixedCode}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cospail-navy/60">
            Documentos
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-cospail-ink">
            Facturas Últimos 6 meses
          </h1>
        </div>
        <BackButton onClick={() => navigate('/menu')} />
      </div>

      {invoicesQuery.isLoading ? (
        <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-cospail-navy/5">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-cospail-sky border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-cospail-ink/60">Cargando facturas…</p>
        </div>
      ) : invoicesQuery.isError ? (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <p className="text-sm font-medium text-red-700">
            No se pudieron cargar las facturas. Inténtalo nuevamente.
          </p>
        </div>
      ) : invoices.length === 0 ? (
        <EmptyState
          icon={ReceiptIcon}
          title="Sin facturas registradas"
          description="No se encontraron facturas de los últimos 6 meses para tu código fijo."
          onBack={() => navigate('/menu')}
        />
      ) : (
        <ul className="space-y-3">
          {invoices.map((invoice) => (
            <li key={invoice.creditNumber}>
              <button
                type="button"
                onClick={() => setSelectedInvoice(invoice)}
                className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border border-cospail-navy/10 bg-white p-4 shadow-sm transition hover:border-cospail-sky/70 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cospail-sky/25"
              >
                <span className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cospail-sky-tint text-cospail-navy">
                    <ReceiptIcon className="h-5 w-5" />
                  </span>
                  <span className="text-left">
                    <span className="block font-semibold text-cospail-ink">
                      {invoice.period || invoice.invoiceNumber || `Crédito ${invoice.creditNumber}`}
                    </span>
                    <span className="block text-xs text-cospail-ink/60">
                      {formatChargeDate(invoice.chargeDate)} · Crédito{' '}
                      <span className="font-mono font-medium text-cospail-navy">
                        {invoice.creditNumber}
                      </span>
                    </span>
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="block font-display text-lg font-bold text-cospail-navy">
                    Bs {invoice.amount.toFixed(2)}
                  </span>
                  <ArrowRightIcon className="h-5 w-5 text-cospail-ink/30 transition group-hover:text-cospail-sky" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <InvoiceViewerModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
    </AppShell>
  )
}
