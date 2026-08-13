import { useNavigate } from 'react-router-dom'

export function VerPagosQrPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Ver Pagos QR</h1>
      <p className="text-slate-600">Esta sección estará disponible próximamente.</p>
      <button
        onClick={() => navigate('/menu')}
        className="rounded-xl border border-slate-300 px-4 py-2 text-slate-600"
      >
        Volver al menú
      </button>
    </div>
  )
}
