import { axiosClient } from './axios-client'

export const paymentsApi = {
    async getMemberDebtByDocument(fixedCode: number, documentId: string) {
        const response = await axiosClient.get('/cospailsoap/member-debt-by-document', {
            params: {
                fixedCode,
                documentId,
            },
        })
        return response.data
    },

    async generateQr(payload: {
        transactionId: string
        amount: number
        description: string
        dueDate: string
        selectedDebtIds: number[]
    }) {
        const response = await axiosClient.post('/BancoEconomico/generate-qr', payload)
        return response.data
    },
}