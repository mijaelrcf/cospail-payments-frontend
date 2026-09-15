import { useNavigate } from 'react-router-dom'
import { EmptyState } from '../components/empty-state'
import { InfoIcon } from '../components/icons'

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:px-8">
      <EmptyState
        icon={InfoIcon}
        title="Página no encontrada"
        description="La ruta que buscas no existe."
        onBack={() => navigate('/', { replace: true })}
      />
    </div>
  )
}
