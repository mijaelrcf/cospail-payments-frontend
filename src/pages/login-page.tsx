import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMemberDebt } from '../hooks/use-member-debt'
import { usePaymentStore } from '../store/payment-store'
import { MemberDebtStatus } from '../types/member-debt-response'

export function LoginPage() {
  const [fixedCode, setFixedCode] = useState('')
  const [documentId, setDocumentId] = useState('')
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const memberDebtMutation = useMemberDebt()
  const {
    setDebtResponse,
    setFixedCode: setStoreFixedCode,
    setDocumentId: setStoreDocumentId,
  } = usePaymentStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const result = await memberDebtMutation.mutateAsync({
        fixedCode: Number(fixedCode),
        documentId,
      })

      if (result.status === MemberDebtStatus.DocumentMismatch) {
        setError('El documento de identidad no coincide con el código fijo.')
        return
      }

      if (result.status === MemberDebtStatus.MemberNotFound) {
        setError('No se encontró un socio con el código fijo indicado.')
        return
      }

      setStoreFixedCode(result.fixedCode)
      setStoreDocumentId(result.documentId)
      setDebtResponse(result)
      navigate('/menu')
    } catch {
      setError('No se pudo conectar con el servicio. Inténtalo nuevamente.')
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <div className="space-y-6 rounded-2xl bg-white p-6 shadow">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Cospail Payments</h1>
          <p className="mt-2 text-slate-600">Ingresa para gestionar tus pagos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={memberDebtMutation.isPending}
            className="w-full rounded-xl bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {memberDebtMutation.isPending ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
