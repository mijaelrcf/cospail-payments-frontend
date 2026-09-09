import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { AppShell, BackButton } from '../components/app-shell'
import { DebtList } from '../components/debt-list'
import { CheckIcon, InfoIcon } from '../components/icons'
import { PendingQrCard } from '../components/pending-qr-card'
import { getApiErrorMessage } from '../api/payments'
import { useActiveQr } from '../hooks/use-active-qr'
import { useInitiatePayment } from '../hooks/use-initiate-payment'
import { useGenerateQr } from '../hooks/use-generate-qr'
import { usePaymentStore } from '../store/payment-store'
import type { DebtItem } from '../types/debt-item'

const isOlder = (a: DebtItem, b: DebtItem) =>
  a.year < b.year || (a.year === b.year && a.month < b.month)

export function PagoQrPage() {
  const {
    debtResponse,
    selectedDebts,
    setSelectedDebts,
    setQrResult,
    setInitiatedPayment,
  } = usePaymentStore()

  const [selectionError, setSelectionError] = useState<string | null>(null)
  const [flowError, setFlowError] = useState<string | null>(null)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const initiatePaymentMutation = useInitiatePayment()
  const generateQrMutation = useGenerateQr()

  const activeQrQuery = useActiveQr(debtResponse?.fixedCode, debtResponse?.documentId)

  useEffect(() => {
    if (!debtResponse) {
      navigate('/', { replace: true })
    }
  }, [debtResponse, navigate])

  if (!debtResponse || !activeQrQuery.isSuccess) return null

  const activeQr = activeQrQuery.data

  const toggleDebt = (item: DebtItem) => {
    setSelectionError(null)
    setFlowError(null)

    const exists = selectedDebts.some((x) => x.creditNumber === item.creditNumber)

    if (exists) {
      setSelectedDebts(selectedDebts.filter((x) => isOlder(x, item)))
      return
    }

    const hasUnselectedOlderDebt = debtResponse.debts.some(
      (debt) => isOlder(debt, item) && !selectedDebts.some((x) => x.creditNumber === debt.creditNumber)
    )

    if (hasUnselectedOlderDebt) {
      setSelectionError(
        'Debes seleccionar primero la deuda más antigua. No puedes pagar una deuda reciente sin haber pagado las anteriores.'
      )
      return
    }

    setSelectedDebts([...selectedDebts, item])
  }

  const refreshDebtsAfterAnnul = () => {
    void queryClient.invalidateQueries({ queryKey: ['active-qr'] })
    setSelectedDebts([])
  }

  const handleGenerateQr = async () => {
    setFlowError(null)

    try {
      const payment = await initiatePaymentMutation.mutateAsync({
        fixedCode: debtResponse.fixedCode,
        documentId: debtResponse.documentId,
        debts: selectedDebts.map((x) => ({
          creditNumber: x.creditNumber,
          type: x.type,
          amount: x.amount,
        })),
      })

      setInitiatedPayment(payment)

      const result = await generateQrMutation.mutateAsync({
        pagoCospailId: payment.pagoCospailId,
      })

      setQrResult(result)
      await queryClient.invalidateQueries({ queryKey: ['active-qr'] })
      navigate('/qr-result')
    } catch (error) {
      // Si el rechazo es por un QR ya pendiente, se recarga la validación
      // para mostrar el QR activo en lugar del formulario.
      await activeQrQuery.refetch()
      setFlowError(
        getApiErrorMessage(
          error,
          'Ocurrió un error al generar el QR. El servicio no está disponible en este momento. Por favor, inténtalo más tarde.'
        )
      )
    }
  }

  const total = selectedDebts.reduce((sum, item) => sum + item.amount, 0)

  return (
    <AppShell memberName={debtResponse.memberName} fixedCode={debtResponse.fixedCode}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="mt-1 font-display text-xl font-bold text-cospail-ink">Pago QR</h1>
        </div>
        <BackButton onClick={() => navigate('/menu')} />
      </div>

      {activeQrQuery.isFetching ? (
        <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-cospail-navy/5">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-cospail-sky border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-cospail-ink/60">
            Verificando pagos pendientes…
          </p>
        </div>
      ) : activeQr ? (
        <>
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cospail-navy/60">
              Tienes un QR pendiente
            </p>
            <p className="mt-1 text-sm text-cospail-ink/60">
              Debes pagarlo o anularlo antes de generar uno nuevo.
            </p>
          </div>

          <PendingQrCard
            pagoCospailId={activeQr.pagoCospailId}
            qrImage={activeQr.qrImage}
            amount={activeQr.amount}
            dueDate={activeQr.dueDate}
            onAnnulled={refreshDebtsAfterAnnul}
          />
        </>
      ) : debtResponse.debts.length ? (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cospail-navy/60">
              Paso 1 · Selecciona tus deudas
            </p>
          </div>

          <DebtList items={debtResponse.debts} selectedItems={selectedDebts} onToggle={toggleDebt} />

          {selectionError && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
              <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <p className="text-sm font-medium text-amber-800">{selectionError}</p>
            </div>
          )}

          {flowError && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <p className="text-sm font-medium text-red-700">{flowError}</p>
            </div>
          )}

          <div className="mt-6 flex flex-col items-stretch justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-cospail-navy/5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-cospail-ink/50">
                Total seleccionado
              </p>
              <p className="font-display text-2xl font-bold text-cospail-ink">
                Bs {total.toFixed(2)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerateQr}
              disabled={
                !selectedDebts.length ||
                initiatePaymentMutation.isPending ||
                generateQrMutation.isPending
              }
              className="rounded-xl bg-cospail-green px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cospail-green-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cospail-green/30 disabled:opacity-50"
            >
              {initiatePaymentMutation.isPending
                ? 'Registrando pago…'
                : generateQrMutation.isPending
                  ? 'Generando QR…'
                  : 'Generar QR'}
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-cospail-navy/20 bg-white/70 px-6 py-16 text-center shadow-sm">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cospail-green-tint text-cospail-green-dark">
            <CheckIcon className="h-7 w-7" />
          </span>
          <h2 className="mt-4 font-display text-xl font-semibold text-cospail-ink">
            No tienes deudas pendientes
          </h2>
          <p className="mt-1 max-w-sm text-sm text-cospail-ink/60">
            Tu cuenta de agua está al día. ¡Gracias por cumplir con tu cooperativa!
          </p>
        </div>
      )}
    </AppShell>
  )
}
