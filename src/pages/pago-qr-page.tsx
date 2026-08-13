import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DebtList } from '../components/debt-list'
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

  const navigate = useNavigate()
  const initiatePaymentMutation = useInitiatePayment()
  const generateQrMutation = useGenerateQr()

  useEffect(() => {
    if (!debtResponse) {
      navigate('/', { replace: true })
    }
  }, [debtResponse, navigate])

  if (!debtResponse) return null

  const toggleDebt = (item: DebtItem) => {
    setSelectionError(null)

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

  const handleGenerateQr = async () => {
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
      transactionId: crypto.randomUUID(),
      pagoCospailId: payment.pagoCospailId,
      currency: 'BOB',
      description: 'Pago de deudas Cospail',
      dueDate: new Date().toISOString().split('T')[0],
    })

    setQrResult(result)
    navigate('/qr-result')
  }

  const total = selectedDebts.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pago QR</h1>
        <button
          onClick={() => navigate('/menu')}
          className="rounded-xl border border-slate-300 px-4 py-2 text-slate-600"
        >
          Volver al menú
        </button>
      </div>

      <div className="rounded-2xl bg-slate-100 p-4">
        <p className="font-semibold">Código Fijo: {debtResponse.fixedCode}</p>
        <p>Socio: {debtResponse.memberName}</p>
      </div>

      {debtResponse.debts.length ? (
        <>
          <DebtList
            items={debtResponse.debts}
            selectedItems={selectedDebts}
            onToggle={toggleDebt}
          />

          {selectionError && (
            <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-700 font-medium">
              {selectionError}
            </p>
          )}

          <div className="rounded-2xl bg-white p-4 shadow">
            <p className="mb-3 text-lg font-bold">
              Total seleccionado: Bs {total.toFixed(2)}
            </p>

            <button
              onClick={handleGenerateQr}
              disabled={
                !selectedDebts.length ||
                initiatePaymentMutation.isPending ||
                generateQrMutation.isPending
              }
              className="rounded-xl bg-green-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {initiatePaymentMutation.isPending
                ? 'Registrando pago...'
                : generateQrMutation.isPending
                  ? 'Generando QR...'
                  : 'Generar QR'}
            </button>
          </div>
        </>
      ) : (
        <div className="rounded-2xl bg-slate-100 p-4">
          <p className="text-slate-600">El socio no tiene deudas pendientes.</p>
        </div>
      )}
    </div>
  )
}
