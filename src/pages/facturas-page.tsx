import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell, BackButton } from '../components/app-shell'
import { EmptyState } from '../components/empty-state'
import { InfoIcon, ReceiptIcon } from '../components/icons'
import { InvoiceViewerModal } from '../components/invoice-viewer-modal'
import { useInvoices } from '../hooks/use-invoices'
import { usePaymentStore } from '../store/payment-store'
import type { InvoiceSummary } from '../types/invoice'

function formatMonth(value: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const formatted = date.toLocaleDateString('es-BO', { month: 'long', year: 'numeric' })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
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

  const sortedInvoices = useMemo(() => {
    const list = [...(invoicesQuery.data ?? [])]
    list.sort((a, b) => {
      const dateA = a.chargeDate ? new Date(a.chargeDate).getTime() : 0
      const dateB = b.chargeDate ? new Date(b.chargeDate).getTime() : 0
      if (dateB !== dateA) return dateB - dateA
      return b.creditNumber - a.creditNumber
    })
    return list
  }, [invoicesQuery.data])

  if (!debtResponse) return null

  const invoices = sortedInvoices

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
        <div className="overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-cospail-navy/5">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-cospail-navy/10 text-xs font-semibold uppercase tracking-[0.12em] text-cospail-navy/60">
                <th scope="col" className="px-5 py-4">
                  Mes
                </th>
                <th scope="col" className="px-5 py-4 text-right">
                  Monto
                </th>
                <th scope="col" className="px-5 py-4 text-right">
                  Factura
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.creditNumber}
                  className="border-b border-cospail-navy/5 transition last:border-0 hover:bg-cospail-sky-tint/40"
                >
                  <td className="px-5 py-4 font-semibold text-cospail-ink">
                    {formatMonth(invoice.chargeDate)}
                  </td>
                  <td className="px-5 py-4 text-right font-display font-bold text-cospail-navy">
                    Bs {invoice.amount.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedInvoice(invoice)}
                      className="font-semibold text-cospail-sky underline decoration-cospail-sky/40 underline-offset-4 transition hover:text-cospail-navy hover:decoration-cospail-navy focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cospail-sky/30 rounded"
                    >
                      Ver Factura
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <InvoiceViewerModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
    </AppShell>
  )
}
