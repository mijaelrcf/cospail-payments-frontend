import { DownloadIcon } from './icons'
import { buildTimestampSuffix, toQrDataUrl } from '../utils/format'

interface Props {
  qrBase64: string
  fileName?: string
}

export function QrViewer({ qrBase64, fileName }: Props) {
  const qrDataUrl = toQrDataUrl(qrBase64)
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = fileName ?? `qr-cospail-${buildTimestampSuffix()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-lg ring-1 ring-cospail-navy/5">
      <div className="mx-auto max-w-xs rounded-2xl bg-white p-4 shadow-inner ring-4 ring-cospail-sky/25">
        <img
          src={qrDataUrl}
          alt="Código QR"
          className="mx-auto w-full"
        />
      </div>
      <p className="mt-5 text-sm text-cospail-ink/60">
        Escanea el código con la aplicación de tu banco para completar el pago.
      </p>
      <button
        type="button"
        onClick={handleDownload}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cospail-navy px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cospail-navy-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cospail-sky/40"
      >
        <DownloadIcon className="h-5 w-5" />
        Descargar QR
      </button>
    </div>
  )
}
