import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMemberDebt } from '../hooks/use-member-debt'
import { getApiErrorMessage } from '../api/payments'
import { usePaymentStore } from '../store/payment-store'
import { MemberDebtStatus } from '../types/member-debt-response'
import { BrandHeader } from '../components/brand-header'
import { AnimatedWave } from '../components/wave'
import { CheckIcon } from '../components/icons'
import { ErrorBox } from '../components/ui'

const inputClasses =
  'w-full rounded-xl border border-cospail-navy/20 bg-white px-4 py-3 text-sm text-cospail-ink shadow-sm outline-none transition placeholder:text-cospail-ink/35 focus:border-cospail-sky focus:ring-4 focus:ring-cospail-sky/20'

const LOGIN_BENEFITS = [
  'Sin filas ni horarios',
  'Paga desde tu banca móvil',
  'Consulta tu historial de facturas',
]

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedDocument = documentId.trim()
    const parsedCode = Number(fixedCode)
    if (!Number.isInteger(parsedCode) || parsedCode <= 0) {
      setError('Ingresa un código fijo válido.')
      return
    }
    if (!trimmedDocument) {
      setError('Ingresa tu documento de identidad.')
      return
    }

    try {
      const result = await memberDebtMutation.mutateAsync({
        fixedCode: parsedCode,
        documentId: trimmedDocument,
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
    } catch (error) {
      setError(
        getApiErrorMessage(error, 'No se pudo conectar con el servicio. Inténtalo nuevamente.')
      )
    }
  }

  return (
    <div className="min-h-screen bg-cospail-surface">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 py-10">
        <div className="w-full overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-cospail-navy/10 sm:grid sm:grid-cols-5">
          <div className="relative overflow-hidden bg-linear-to-br from-cospail-navy-dark via-cospail-navy to-cospail-navy-light p-8 sm:col-span-2 sm:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cospail-sky/20 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-cospail-green/15 blur-3xl"
            />

            <div className="relative">
              <BrandHeader />

              <div className="mt-12 space-y-3">
                <h1 className="font-display text-2xl font-bold leading-snug text-white">
                  Tu agua, tus pagos,
                  <br />
                  más simples.
                </h1>
                <ul className="space-y-2.5">
                  {LOGIN_BENEFITS.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-white/80">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cospail-green/90 text-white">
                        <CheckIcon className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-16 overflow-hidden">
              <AnimatedWave className="animate-wave absolute bottom-0 left-0 h-full w-[200%] text-white" />
            </div>
          </div>

          <div className="flex flex-col justify-center p-8 sm:col-span-3 sm:p-10">
            <div className="mx-auto w-full max-w-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cospail-navy/70">
                Acceso de socios
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-cospail-ink">
                Ingresa con tu código
              </h2>
              <p className="mt-1.5 text-sm text-cospail-ink/60">
                Usa tu código fijo y documento de identidad para gestionar tus pagos.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="fixedCode" className="mb-1.5 block text-sm font-medium text-cospail-ink">
                    Código Fijo
                  </label>
                  <input
                    id="fixedCode"
                    type="number"
                    value={fixedCode}
                    onChange={(e) => setFixedCode(e.target.value)}
                    className={inputClasses}
                    placeholder="Ej. 1234"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="documentId" className="mb-1.5 block text-sm font-medium text-cospail-ink">
                    Documento de Identidad
                  </label>
                  <input
                    id="documentId"
                    type="text"
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                    className={inputClasses}
                    placeholder="Ej. 5678901"
                    required
                  />
                </div>

                {error && (
                  <ErrorBox message={error} />
                )}

                <button
                  type="submit"
                  disabled={memberDebtMutation.isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cospail-navy px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cospail-navy-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cospail-sky/40 disabled:opacity-50"
                >
                  {memberDebtMutation.isPending && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}
                  {memberDebtMutation.isPending ? 'Ingresando…' : 'Ingresar'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
