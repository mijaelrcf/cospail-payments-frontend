export function formatCurrency(amount: number): string {
  return `Bs ${amount.toFixed(2)}`
}

export function formatMonth(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const formatted = date.toLocaleDateString('es-BO', { month: 'long', year: 'numeric' })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function buildTimestampSuffix(date = new Date()): string {
  const yy = String(date.getFullYear()).slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${yy}${month}${day}-${hours}${minutes}`
}

export function toQrDataUrl(qrBase64: string): string {
  return `data:image/png;base64,${qrBase64}`
}
