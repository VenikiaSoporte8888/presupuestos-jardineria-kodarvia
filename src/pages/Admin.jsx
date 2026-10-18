import { useStore } from '../store.jsx'
import { useAuth } from '../auth.jsx'
import Gate from './Gate.jsx'
import { countByStatus, monthLabel, monthTotals, money } from '../lib/quotes.js'
import { ConfirmButton } from '../components/ui.jsx'
import { IconRefresh, IconTrash } from '../components/icons.jsx'

export default function Admin() {
  const { open, lock } = useAuth()
  // Mientras no se ponga la clave, esta pantalla no lee ni muestra ningún presupuesto.
  return open ? <Panel onExit={lock} /> : <Gate />
}

function Panel({ onExit }) {
  const { quotes, restoreSample, clearAll } = useStore()
  const now = new Date()
  const t = monthTotals(quotes, now)
  const c = countByStatus(quotes)
  const rate = t.quoted > 0 ? Math.round((t.accepted / t.quoted) * 100) : 0

  return (
    <div className="space-y-5">
      <div className="no-print flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold leading-tight">Administración</h1>
          <p className="mt-1 text-ink-600 first-letter:uppercase">Resumen de {monthLabel(now)}</p>
        </div>
        <button type="button" className="btn-ghost" onClick={onExit}>
          Cerrar sesión
        </button>
      </div>

      <div className="no-print grid gap-3 sm:grid-cols-2">
        <section className="rounded-2xl bg-ink-800 p-5 text-white" aria-label="Total presupuestado del mes">
          <p className="text-sm font-semibold text-ink-200">Total presupuestado del mes</p>
          <p data-testid="total-cotizado" className="mt-1 text-3xl font-semibold leading-tight">
            {money(t.quoted)}
          </p>
          <p className="mt-1 text-sm text-ink-200">
            {t.count} {t.count === 1 ? 'presupuesto enviado' : 'presupuestos enviados'} este mes
          </p>
        </section>
        <section className="rounded-2xl bg-emerald-600 p-5 text-white" aria-label="Total aceptado del mes">
          <p className="text-sm font-semibold text-emerald-50">Total aceptado del mes</p>
          <p data-testid="total-aceptado" className="mt-1 text-3xl font-semibold leading-tight">
            {money(t.accepted)}
          </p>
          <p className="mt-1 text-sm text-emerald-50">
            {t.acceptedCount} {t.acceptedCount === 1 ? 'aceptado' : 'aceptados'} · {rate}% del importe presupuestado
          </p>
        </section>
      </div>

      <section className="no-print card">
        <h2 className="text-lg font-semibold">Todos los presupuestos</h2>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <div className="rounded-xl bg-sand-100 p-3">
            <dt className="text-ink-600">En total</dt>
            <dd className="text-lg font-semibold">{c.todas}</dd>
          </div>
          <div className="rounded-xl bg-amber-100 p-3 text-amber-950">
            <dt>Pendientes</dt>
            <dd className="text-lg font-semibold">{c.pendiente}</dd>
          </div>
          <div className="rounded-xl bg-emerald-100 p-3 text-emerald-950">
            <dt>Aceptados</dt>
            <dd className="text-lg font-semibold">{c.aceptada}</dd>
          </div>
          <div className="rounded-xl bg-rose-100 p-3 text-rose-950">
            <dt>Rechazados</dt>
            <dd className="text-lg font-semibold">{c.rechazada}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-ink-600">
          “Presupuestado” suma los presupuestos <strong>enviados</strong> este mes. “Aceptado” suma los que están en estado Aceptado y se
          aceptaron este mes. Se recalcula solo cuando cambias un estado.
        </p>
      </section>

      <section className="no-print card space-y-3">
        <h2 className="text-lg font-semibold">Datos de ejemplo</h2>
        <p className="text-sm text-ink-600">
          Al abrir la app por primera vez se cargan 14 presupuestos de ejemplo (inventados). Puedes volver a cargarlos, o vaciar todo
          para empezar con los datos reales.
        </p>
        <div className="flex flex-wrap gap-2">
          <ConfirmButton
            className="btn-ghost"
            label={
              <>
                <IconRefresh size={17} /> Restaurar datos de ejemplo
              </>
            }
            confirmLabel="Sí, reemplazar todo"
            onConfirm={restoreSample}
          />
          <ConfirmButton
            label={
              <>
                <IconTrash size={17} /> Vaciar todos los datos
              </>
            }
            confirmLabel="Sí, vaciar todo"
            onConfirm={clearAll}
          />
        </div>
      </section>
    </div>
  )
}
