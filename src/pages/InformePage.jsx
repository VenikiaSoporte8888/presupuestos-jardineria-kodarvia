import { useStore } from '../store.jsx'
import { useAuth } from '../auth.jsx'
import Gate from './Gate.jsx'
import Informe from './Informe.jsx'

/** Página aparte del informe mensual (extra). Pide la misma clave que /admin porque muestra presupuestos. */
export default function InformePage() {
  const { open } = useAuth()
  const { quotes } = useStore()
  return open ? (
    <div className="space-y-5">
      <h1 className="no-print text-2xl font-semibold leading-tight">Informe mensual</h1>
      <Informe quotes={quotes} />
    </div>
  ) : (
    <Gate title="Informe mensual" />
  )
}
