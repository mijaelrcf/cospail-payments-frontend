import { useEffect, useMemo, useRef } from 'react'
import { useInvoicePdf } from '../hooks/use-invoices'
import { formatCurrency } from '../utils/format'
import { XIcon } from './icons'
import { ErrorBox, LoadingState } from './ui'
import type { InvoiceSummary } from '../types/invoice'

interface Props {
  invoice: InvoiceSummary | null
  onClose: () => void
}

function base64ToBlobUrl(base64: string, contentType: string): string {
  const binary = atob(base64)
  const chunkSize = 8192
  const chunks: BlobPart[] = []
  for (let i = 0; i < binary.length; i += chunkSize) {
    const chunk = binary.slice(i, i + chunkSize)
    const bytes = new Uint8Array(chunk.length)
    for (let j = 0; j < chunk.length; j += 1) {
      bytes[j] = chunk.charCodeAt(j)
    }
    chunks.push(bytes)
  }
  return URL.createObjectURL(new Blob(chunks, { type: contentType }))
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
    } else if (dialog.open) {
      dialog.close()
    }
  }, [invoice, onClose])

  const handlePrint = () => {
    iframeRef.current?.contentWindow?.focus()
    iframeRef.current?.contentWindow?.print()
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
            Factura #{invoice?.creditNumber ?? ''}
          </h2>
          {invoice && (
            <p className="mt-0.5 text-xs text-cospail-ink/60">
              Crédito{' '}
              <span className="font-mono font-medium text-cospail-navy">{invoice.creditNumber}</span>
              {' · '}{formatCurrency(invoice.amount)}
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
        <LoadingState message="Cargando factura…" />
      ) : pdfQuery.isError || !pdfQuery.data || !blobUrl ? (
        <ErrorBox message="No se pudo cargar la factura. Inténtalo nuevamente." />
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
