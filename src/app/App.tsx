import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { usePageviewBeacon } from '../hooks/use-pageview-beacon'

export default function App() {
  usePageviewBeacon()
  return <RouterProvider router={router} />
}