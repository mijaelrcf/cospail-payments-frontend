import { useEffect, useMemo, useRef } from 'react'
import { useInvoicePdf } from '../hooks/use-invoices'
import { InfoIcon, XIcon } from './icons'
import type { InvoiceSummary } from '../types/invoice'

interface Props {
  invoice: InvoiceSummary | null
  onClose: () => void
}

function base64ToBlobUrl(base64: string, contentType: string): string {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return URL.createObjectURL(new Blob([bytes], { type: contentType }))
}

export function InvoiceViewerModal({ invoice, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const creditNumber = invoice?.creditNumber ?? null
  const pdfQuery = useInvoicePdf(creditNumber)

  const blobUrl = useMemo(() => {
    if (!pdfQuery.data?.pdfBase64) return null
    try {
      return base64ToBlobUrl(pdfQuery.data.pdfBase64, pdfQuery.data.contentType || 'application/pdf')
    } catch {
      return null
    }
  }, [pdfQuery.data])

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [blobUrl])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (invoice) {
      if (!dialog.open) dialog.showModal()
    } else {
      dialog.close()
    }
  }, [invoice])

  const handlePrint = () => {
    const iframe = iframeRef.current
    if (iframe?.contentWindow) {
      iframe.contentWindow.focus()
      iframe.contentWindow.print()
    } else {
      window.print()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto w-full max-w-3xl rounded-3xl bg-white p-0 shadow-xl ring-1 ring-cospail-navy/10 backdrop:bg-cospail-ink/40 backdrop:backdrop-blur-sm sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-cospail-ink">
            Factura {invoice?.invoiceNumber || `#${invoice?.creditNumber ?? ''}`}
          </h2>
          {invoice && (
            <p className="mt-0.5 text-xs text-cospail-ink/60">
              {invoice.period || 'Período no disponible'} · Crédito{' '}
              <span className="font-mono font-medium text-cospail-navy">{invoice.creditNumber}</span>
              {' · '}Bs {invoice.amount.toFixed(2)}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-cospail-ink/40 transition hover:bg-cospail-surface hover:text-cospail-ink"
          aria-label="Cerrar"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>

      {pdfQuery.isLoading ? (
        <div className="flex flex-col items-center rounded-2xl bg-cospail-surface px-6 py-16 text-center">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-cospail-sky border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-cospail-ink/60">Cargando factura…</p>
        </div>
      ) : pdfQuery.isError || !pdfQuery.data || !blobUrl ? (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <p className="text-sm font-medium text-red-700">
            No se pudo cargar la factura. Inténtalo nuevamente.
          </p>
        </div>
      ) : (
        <>
          <iframe
            ref={iframeRef}
            src={blobUrl}
            title={`Factura ${invoice?.creditNumber ?? ''}`}
            className="h-[60vh] w-full rounded-2xl border border-cospail-navy/10 bg-white"
          />
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <a
              href={blobUrl}
              download={pdfQuery.data.fileName || `factura-${creditNumber}.pdf`}
              className="rounded-xl border border-cospail-navy/15 bg-white px-5 py-2.5 text-sm font-semibold text-cospail-navy shadow-sm transition hover:border-cospail-sky hover:bg-cospail-sky-tint focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cospail-sky/30"
            >
              Descargar
            </a>
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-xl bg-cospail-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cospail-navy-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cospail-sky/40"
            >
              Imprimir
            </button>
          </div>
        </>
      )}
    </dialog>
  )
}
