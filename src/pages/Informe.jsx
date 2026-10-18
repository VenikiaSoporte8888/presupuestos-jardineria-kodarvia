import { useMemo, useState } from 'react'
import { BUSINESS } from '../config.js'
import { fmtDate, money, monthKeys, monthReport, waitingDays } from '../lib/quotes.js'

const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1)

/** Informe mensual (página propia): totales, respuestas y detalle del mes elegido. Se puede imprimir o guardar en PDF. */
export default function Informe({ quotes }) {
  const keys = useMemo(() => monthKeys(quotes), [quotes])
  const [key, setKey] = useState(keys[0])
  const month = keys.includes(key) ? key : keys[0]
  const r = useMemo(() => monthReport(quotes, month), [quotes, month])
  const empty = r.sentCount === 0 && r.accepted.length === 0 && r.rejected.length === 0

  return (
    <section className="card space-y-5" aria-label="Informe mensual" data-testid="informe">
      <div className="no-print flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Informe mensual</h2>
          <p className="mt-0.5 text-sm text-ink-600">Elige un mes. Puedes imprimirlo o guardarlo en PDF.</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <div className="min-w-0 sm:w-56">
            <label htmlFor="informe-mes" className="sr-only">
              Mes del informe
            </label>
            <select id="informe-mes" className="field" value={month} onChange={(e) => setKey(e.target.value)}>
              {keys.map((k) => (
                <option key={k} value={k}>
                  {cap(monthReport([], k).label)}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="btn-ghost w-full sm:w-auto" onClick={() => window.print()}>
            Imprimir / PDF
          </button>
        </div>
      </div>

      {/* Título que solo importa al imprimir, pero también sirve en pantalla. */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{BUSINESS.name} · Informe mensual</p>
        <p className="text-xl font-semibold" data-testid="informe-mes-titulo">
          {cap(r.label)}
        </p>
      </div>

      {empty ? (
        <p className="rounded-2xl bg-sand-100 px-4 py-8 text-center text-sm text-ink-600">No hay presupuestos en este mes.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <Tile cls="bg-ink-800 text-white" label="Total presupuestado" value={money(r.quoted)} testid="informe-cotizado" hint={`${r.sentCount} enviados`} />
            <Tile cls="bg-emerald-600 text-white" label="Total aceptado" value={money(r.acceptedAmount)} testid="informe-aceptado" hint={`${r.accepted.length} aceptados`} />
            <Tile cls="bg-amber-400 text-amber-950" label="Siguen pendientes" value={r.pending.length} testid="informe-pendientes" hint={money(r.pendingAmount)} />
            <Tile cls="bg-rose-100 text-rose-950" label="Rechazados" value={r.rejected.length} testid="informe-rechazadas" hint={money(r.rejectedAmount)} />
            <Tile cls="bg-sand-100 text-ink-900 col-span-2 sm:col-span-2" label="De los que respondieron" value={r.rate === null ? 'Aún sin respuestas' : `${r.rate}% aceptados`} testid="informe-tasa" small />
          </div>

          <Group title="Aceptados este mes" rows={r.accepted} render={(q) => [q.client, `Aceptado el ${fmtDate(q.decidedDate || q.sentDate)}${q.signedBy ? ` · firmó ${q.signedBy}` : ''}`, money(q.amount)]} />
          <Group title="Pendientes de respuesta" rows={r.pending} render={(q) => [q.client, `Enviado el ${fmtDate(q.sentDate)} · ${waitingDays(q.sentDate)} días sin respuesta${q.notes?.pendiente ? ` · ${q.notes.pendiente}` : ''}`, money(q.amount)]} />
          <Group title="Rechazados este mes" rows={r.rejected} render={(q) => [q.client, `Rechazado el ${fmtDate(q.decidedDate || q.sentDate)}${q.notes?.rechazada ? ` · ${q.notes.rechazada}` : ''}`, money(q.amount)]} />
        </>
      )}
    </section>
  )
}

function Tile({ cls, label, value, hint, testid, small }) {
  return (
    <div className={`rounded-2xl px-4 py-3.5 ${cls}`}>
      <p className="text-xs font-semibold opacity-80">{label}</p>
      <p data-testid={testid} className={`mt-1 font-semibold leading-tight ${small ? 'text-lg' : 'text-2xl'}`}>
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs opacity-80">{hint}</p>}
    </div>
  )
}

function Group({ title, rows, render }) {
  if (rows.length === 0) return null
  return (
    <div>
      <h3 className="mb-1.5 text-sm font-semibold text-ink-700">
        {title} ({rows.length})
      </h3>
      <ul className="divide-y divide-sand-200 overflow-hidden rounded-xl border border-sand-200">
        {rows.map((q) => {
          const [name, sub, amount] = render(q)
          return (
            <li key={q.id} className="flex items-start justify-between gap-3 px-3.5 py-2.5">
              <span className="min-w-0">
                <span className="block break-words text-sm font-semibold">{name}</span>
                <span className="block text-xs text-ink-600">{sub}</span>
              </span>
              <span className="shrink-0 text-sm font-semibold">{amount}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
