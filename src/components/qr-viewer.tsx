interface Props {
  qrBase64: string
}

export function QrViewer({ qrBase64 }: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow text-center">
      <img
        src={`data:image/png;base64,${qrBase64}`}
        alt="Código QR"
        className="mx-auto max-w-full rounded-xl"
      />
    </div>
  )
}
