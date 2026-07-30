interface Props {
  qrBase64: string
}

export function QrViewer({ qrBase64 }: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow text-center">
      <h2 className="mb-4 text-xl font-bold">Código QR</h2>
      <img
        src={`data:image/png;base64,${qrBase64}`}
        alt="Código QR"
        className="mx-auto max-w-full rounded-xl"
      />
    </div>
  )
}