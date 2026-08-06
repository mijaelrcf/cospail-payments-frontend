import { createBrowserRouter } from 'react-router-dom'
import { PaymentPage } from '../pages/payment-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PaymentPage />,
  },
])