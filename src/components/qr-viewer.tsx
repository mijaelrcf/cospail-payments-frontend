interface Props {
  qrBase64: string
}

export function QrViewer({ qrBase64 }: Props) {
  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-lg ring-1 ring-cospail-navy/5">
      <div className="mx-auto max-w-xs rounded-2xl bg-white p-4 shadow-inner ring-4 ring-cospail-sky/25">
        <img
          src={`data:image/png;base64,${qrBase64}`}
          alt="Código QR"
          className="mx-auto w-full"
        />
      </div>
      <p className="mt-5 text-sm text-cospail-ink/60">
        Escanea el código con la aplicación de tu banco para completar el pago.
      </p>
    </div>
  )
}
