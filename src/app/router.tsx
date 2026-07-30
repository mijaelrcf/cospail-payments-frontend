import { createBrowserRouter } from 'react-router-dom'
import { PaymentPage } from '../presentation/pages/payment-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PaymentPage />,
  },
])