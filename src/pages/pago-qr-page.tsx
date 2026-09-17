import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { AppShell, BackButton } from '../components/app-shell'
import { DebtList } from '../components/debt-list'
import { EmptyState } from '../components/empty-state'
import { CheckIcon, InfoIcon } from '../components/icons'
import { ActiveQrCard } from '../components/active-qr-card'
import { ErrorBox, FullscreenLoading, LoadingState, PageHeader } from '../components/ui'
import { getApiErrorMessage } from '../api/payments'
import { useActiveQr } from '../hooks/use-active-qr'
import { useInitiatePayment } from '../hooks/use-initiate-payment'
import { useGenerateQr } from '../hooks/use-generate-qr'
import { useRefreshAfterPayment } from '../hooks/use-refresh-after-payment'
import { useRequireAuth } from '../hooks/use-require-auth'
import { usePaymentStore } from '../store/payment-store'
import { formatCurrency } from '../utils/format'
import { queryKeys } from '../utils/query-keys'
import type { DebtItem } from '../types/debt-item'

const isOlder = (a: DebtItem, b: DebtItem) =>
  a.year < b.year || (a.year === b.year && a.month < b.month)

export function PagoQrPage() {
  const debtResponse = useRequireAuth()
  const selectedDebts = usePaymentStore((s) => s.selectedDebts)
  const setSelectedDebts = usePaymentStore((s) => s.setSelectedDebts)
  const setDebtResponse = usePaymentStore((s) => s.setDebtResponse)
  const setQrResult = usePaymentStore((s) => s.setQrResult)
  const setInitiatedPayment = usePaymentStore((s) => s.setInitiatedPayment)

  const [selectionError, setSelectionError] = useState<string | null>(null)
  const [flowError, setFlowError] = useState<string | null>(null)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const initiatePaymentMutation = useInitiatePayment()
  const generateQrMutation = useGenerateQr()
  const refreshAfterPayment = useRefreshAfterPayment()

  const activeQrQuery = useActiveQr(debtResponse?.fixedCode, debtResponse?.documentId)

  const toggleDebt = (item: DebtItem) => {
    if (!debtResponse) return
    setSelectionError(null)
    setFlowError(null)

    const exists = selectedDebts.some((x) => x.creditNumber === item.creditNumber)

    if (exists) {
      // Al quitar una deuda también se quitan las más nuevas (pago en orden).
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
    void queryClient.invalidateQueries({ queryKey: queryKeys.activeQrRoot })
    setSelectedDebts([])
  }

  const handleGoMenu = () => {
    navigate('/menu', { replace: true })
  }

  const handlePaid = () => {
    void refreshAfterPayment(debtResponse?.fixedCode, debtResponse?.documentId)
  }

  const handleGenerateQr = async () => {
    if (!debtResponse) return
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
      setDebtResponse(debtResponse)
      await queryClient.invalidateQueries({ queryKey: queryKeys.activeQrRoot })
      navigate('/qr-result', { replace: true })
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

  if (!debtResponse || !activeQrQuery.isSuccess) return null

  const activeQr = activeQrQuery.data
  const total = selectedDebts.reduce((sum, item) => sum + item.amount, 0)
  const isGenerating = initiatePaymentMutation.isPending || generateQrMutation.isPending
  const generatingMessage = initiatePaymentMutation.isPending ? 'Registrando pago…' : 'Generando QR…'

  return (
    <AppShell memberName={debtResponse.memberName} fixedCode={debtResponse.fixedCode}>
      <PageHeader title="Pago QR" action={<BackButton onClick={handleGoMenu} />} />

      {activeQrQuery.isFetching ? (
        <LoadingState message="Verificando pagos pendientes…" />
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

          <ActiveQrCard
            pagoCospailId={activeQr.pagoCospailId}
            qrImage={activeQr.qrImage}
            amount={activeQr.amount}
            dueDate={activeQr.dueDate}
            onAnnulled={refreshDebtsAfterAnnul}
            onPaid={handlePaid}
            onGoMenu={handleGoMenu}
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
            <div className="mt-4">
              <ErrorBox message={flowError} />
            </div>
          )}

          <div className="mt-6 flex flex-col items-stretch justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-cospail-navy/5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-cospail-ink/50">
                Total seleccionado
              </p>
              <p className="font-display text-2xl font-bold text-cospail-ink">
                {formatCurrency(total)}
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
              className="flex items-center justify-center gap-2 rounded-xl bg-cospail-green px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cospail-green-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cospail-green/30 disabled:opacity-50"
            >
              {isGenerating && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {initiatePaymentMutation.isPending
                ? 'Registrando pago…'
                : generateQrMutation.isPending
                  ? 'Generando QR…'
                  : 'Generar QR'}
            </button>
          </div>
        </>
      ) : (
        <EmptyState
          icon={CheckIcon}
          title="No tienes deudas pendientes"
          description="Tu cuenta de agua está al día. ¡Gracias por cumplir con tu cooperativa!"
          onBack={handleGoMenu}
          showBackButton={false}
        />
      )}

      {isGenerating && <FullscreenLoading message={generatingMessage} />}
    </AppShell>
  )
}
