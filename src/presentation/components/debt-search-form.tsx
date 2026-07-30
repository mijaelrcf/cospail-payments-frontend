import { useState } from 'react'

interface Props {
  onSearch: (fixedCode: number, documentId: string) => void
  loading?: boolean
}

export function DebtSearchForm({ onSearch, loading }: Props) {
  const [fixedCode, setFixedCode] = useState('')
  const [documentId, setDocumentId] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(Number(fixedCode), documentId)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow">
      <div>
        <label className="mb-1 block text-sm font-medium">Código Fijo</label>
        <input
          type="number"
          value={fixedCode}
          onChange={(e) => setFixedCode(e.target.value)}
          className="w-full rounded-xl border px-4 py-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Documento de Identidad</label>
        <input
          type="text"
          value={documentId}
          onChange={(e) => setDocumentId(e.target.value)}
          className="w-full rounded-xl border px-4 py-2"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Consultando...' : 'Consultar Deuda'}
      </button>
    </form>
  )
}