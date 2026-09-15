import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePaymentStore } from '../store/payment-store'

/**
 * Redirige a / si no hay sesión (debtResponse).
 * Devuelve debtResponse para evitar el guard duplicado en cada página.
 */
export function useRequireAuth() {
  const debtResponse = usePaymentStore((s) => s.debtResponse)
  const navigate = useNavigate()

  useEffect(() => {
    if (!debtResponse) {
      navigate('/', { replace: true })
    }
  }, [debtResponse, navigate])

  return debtResponse
}
