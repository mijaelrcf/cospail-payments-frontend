import { DebtSearchForm } from '../components/debt-search-form'
import { DebtList } from '../components/debt-list'
import { QrViewer } from '../components/qr-viewer'
import { useMemberDebt } from '../hooks/use-member-debt'
import { useInitiatePayment } from '../hooks/use-initiate-payment'
import { useGenerateQr } from '../hooks/use-generate-qr'
import { usePaymentStore } from '../store/payment-store'
import type { DebtItem } from '../types/debt-item'

export function PaymentPage() {
  const {
    debtResponse,
    selectedDebts,
    qrResult,
    fixedCode,
    documentId,
    initiatedPayment,
    setDebtResponse,
    setSelectedDebts,
    setQrResult,
    setFixedCode,
    setDocumentId,
    setInitiatedPayment,
  } = usePaymentStore()

  const memberDebtMutation = useMemberDebt()
  const initiatePaymentMutation = useInitiatePayment()
  const generateQrMutation = useGenerateQr()

  const handleSearch = async (fixedCode: number, documentId: string) => {
    setQrResult(null)
    setSelectedDebts([])
    setInitiatedPayment(null)
    setFixedCode(fixedCode)
    setDocumentId(documentId)

    const result = await memberDebtMutation.mutateAsync({ fixedCode, documentId })
    setDebtResponse(result)
  }

  const toggleDebt = (item: DebtItem) => {
    const exists = selectedDebts.some((x) => x.creditNumber === item.creditNumber)

    if (exists) {
      setSelectedDebts(selectedDebts.filter((x) => x.creditNumber !== item.creditNumber))
      return
    }

    setSelectedDebts([...selectedDebts, item])
  }

  const handleGenerateQr = async () => {
    if (fixedCode === null || documentId === null) return

    const payment = await initiatePaymentMutation.mutateAsync({
      fixedCode,
      documentId,
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
  }

  const total = selectedDebts.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">Pago de Deudas Cospail</h1>

      <DebtSearchForm
        onSearch={handleSearch}
        loading={memberDebtMutation.isPending}
      />

      {debtResponse && (
        <div className="rounded-2xl bg-slate-100 p-4">
          <p className="font-semibold">Estado: {debtResponse.status}</p>
          <p>Socio: {debtResponse.memberName}</p>
          <p>Mensaje: {debtResponse.message}</p>
        </div>
      )}

      {debtResponse?.debts?.length ? (
        <>
          <DebtList
            items={debtResponse.debts}
            selectedItems={selectedDebts}
            onToggle={toggleDebt}
          />

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
      ) : null}

      {initiatedPayment && !qrResult?.qrImage && (
        <div className="rounded-2xl bg-blue-50 p-4">
          <p className="font-semibold">Pago registrado: Bs {initiatedPayment.totalAmount.toFixed(2)}</p>
        </div>
      )}

      {qrResult?.qrImage && <QrViewer qrBase64={qrResult.qrImage} />}
    </div>
  )
}
