import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '../pages/login-page'
import { MenuPage } from '../pages/menu-page'
import { PagoQrPage } from '../pages/pago-qr-page'
import { QrResultPage } from '../pages/qr-result-page'
import { VerPagosQrPage } from '../pages/ver-pagos-qr-page'
import { FacturasPage } from '../pages/facturas-page'

export const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/menu', element: <MenuPage /> },
  { path: '/pago-qr', element: <PagoQrPage /> },
  { path: '/qr-result', element: <QrResultPage /> },
  { path: '/ver-pagos-qr', element: <VerPagosQrPage /> },
  { path: '/facturas', element: <FacturasPage /> },
])
