import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { QUICK_NOTES, matchesQuery, STATES, STATE_ORDER, STALE_DAYS, countByStatus, fmtDate, money, waitingDays } from '../lib/quotes.js'
import { EmptyState, STATE_STYLE, StatusBadge } from '../components/ui.jsx'
import { IconAlert, IconCheck, IconPlus, IconSearch } from '../components/icons.jsx'
import { LIST_OPEN_BY_DEFAULT } from '../config.js'

const FILTERS = ['todas', ...STATE_ORDER]

export default function Listado() {
  const { quotes, setStatus, updateDetail } = useStore()
  const { state } = useLocation()
  const [filter, setFilter] = useState(LIST_OPEN_BY_DEFAULT ? 'todas' : null)
  const [query, setQuery] = useState('')

  const counts = useMemo(() => countByStatus(quotes), [quotes])
  const totals = useMemo(() => {
    const sum = (list) => list.reduce((t, q) => t + (Number(q.amount) || 0), 0)
    return { quoted: sum(quotes), accepted: sum(quotes.filter((q) => q.status === 'aceptada')) }
  }, [quotes])
  const [moved, setMoved] = useState(null)
  // Al cambiar un estado, avisa a dónde se fue el presupuesto (si no, desaparece de la lista filtrada y parece que no pasó nada).
  const changeStatus = (id, status) => {
    const q = quotes.find((x) => x.id === id)
    setStatus(id, status)
    if (q) setMoved({ client: q.client, status })
  }
  const searching = query.trim() !== ''
  // La lista se ve al elegir un estado o al buscar; mientras tanto solo se ve el menú.
  const showList = filter !== null || searching
  const visible = useMemo(() => {
    if (!showList) return []
    return quotes
      .filter((q) => (filter === null || filter === 'todas' || q.status === filter) && matchesQuery(q, query))
      .sort((a, b) => (a.sentDate < b.sentDate ? 1 : a.sentDate > b.sentDate ? -1 : b.createdAt - a.createdAt))
  }, [quotes, filter, query, showList])

  if (quotes.length === 0) {
    return (
      <EmptyState
        title="Todavía no hay presupuestos"
        action={
          <Link to="/nueva" className="btn-primary">
            <IconPlus size={18} />
            Agregar el primer presupuesto
          </Link>
        }
      >
        Aquí verás cada presupuesto que envíes, con su importe y si el cliente lo aceptó, lo rechazó o sigue sin responder.
      </EmptyState>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold leading-tight">Presupuestos enviados</h1>
          <p className="mt-1 text-ink-600">Quién respondió y a quién hay que llamar.</p>
        </div>
        <Link to="/nueva" className="btn-primary w-full sm:w-auto">
          <IconPlus size={18} />
          Nuevo presupuesto
        </Link>
      </div>

      {state?.saved && (
        <div role="status" className="flex items-start gap-3 rounded-2xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm text-ink-900">
          <IconCheck size={20} className="mt-0.5 shrink-0 text-ink-600" />
          <p>
            Presupuesto de <strong>{state.saved}</strong> guardado como pendiente.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3" data-testid="resumen">
        <div className="col-span-2 rounded-2xl bg-ink-800 px-4 py-3.5 text-white sm:col-span-1">
          <p className="text-xs font-semibold opacity-80">Total presupuestado</p>
          <p className="mt-1 text-xl font-semibold leading-none" data-testid="home-cotizado">{money(totals.quoted)}</p>
          <p className="mt-1 text-xs opacity-80">{quotes.length} presupuestos</p>
        </div>
        <div className="rounded-2xl bg-emerald-600 px-4 py-3.5 text-white">
          <p className="text-xs font-semibold opacity-80">Total aceptado</p>
          <p className="mt-1 text-xl font-semibold leading-none" data-testid="home-aceptado">{money(totals.accepted)}</p>
          <p className="mt-1 text-xs opacity-80">{counts.aceptada} aceptados</p>
        </div>
        <div className="rounded-2xl bg-amber-400 px-4 py-3.5 text-amber-950">
          <p className="text-xs font-semibold opacity-80">Pendientes de respuesta</p>
          <p className="mt-1 text-xl font-semibold leading-none" data-testid="home-pendientes">{counts.pendiente}</p>
          <p className="mt-1 text-xs opacity-80">por cerrar</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4" role="tablist" aria-label="Menú de estados: toca uno para ver sus presupuestos">
        {FILTERS.map((f) => {
          const on = filter === f
          return (
            <button
              key={f}
              role="tab"
              aria-selected={on}
              onClick={() => {
                setMoved(null)
                setFilter(filter === f ? null : f)
              }}
              className={`rounded-2xl border-2 px-3.5 py-3 text-left transition ${
                on ? (f === 'todas' ? 'border-ink-800 bg-ink-800 text-white' : STATE_STYLE[f].on) : f === 'todas' ? 'border-sand-200 bg-white hover:border-ink-500' : STATE_STYLE[f].tabOff
              }`}
            >
              <span className="block text-xl font-semibold leading-none">{counts[f]}</span>
              <span className={`mt-1 block text-xs font-semibold ${on ? 'opacity-90' : f === 'todas' ? 'text-ink-600' : ''}`}>
                {f === 'todas' ? 'Todos' : STATES[f].plural}
              </span>
            </button>
          )
        })}
      </div>

      <label className="relative block">
        <span className="sr-only">Buscar por cliente, fecha, importe o estado</span>
        <IconSearch size={19} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
        <input
          className="field !pl-11"
          type="search"
          placeholder="Cliente, fecha, importe o estado…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {moved && (
        <div role="status" data-testid="aviso-cambio" className="flex items-start justify-between gap-3 rounded-2xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm text-ink-900">
          <p>
            <strong>{moved.client}</strong> pasó a <strong>{STATES[moved.status].label}</strong>.
            {filter !== null && filter !== 'todas' && filter !== moved.status && ` Ahora la verás en ${STATES[moved.status].plural}.`}
          </p>
          <button type="button" className="shrink-0 font-semibold underline" onClick={() => setMoved(null)}>
            Cerrar
          </button>
        </div>
      )}

      {!showList ? (
        <p data-testid="menu-hint" className="rounded-2xl bg-sand-100 px-4 py-8 text-center text-sm text-ink-600">
          Toca <strong>Pendientes</strong>, <strong>Aceptados</strong> o <strong>Rechazados</strong> para ver esos presupuestos, o busca por cliente, fecha o importe.
        </p>
      ) : visible.length === 0 ? (
        <p className="rounded-2xl bg-sand-100 px-4 py-10 text-center text-sm text-ink-600">No hay presupuestos que coincidan.</p>
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {visible.map((q) => (
            <QuoteCard key={q.id} q={q} onStatus={changeStatus} onDetail={updateDetail} isNew={state?.savedId === q.id} />
          ))}
        </ul>
      )}
    </div>
  )
}

function QuoteCard({ q, onStatus, onDetail, isNew }) {
  const st = STATE_STYLE[q.status]
  const days = waitingDays(q.sentDate)
  const stale = q.status === 'pendiente' && days >= STALE_DAYS
  const wait =
    q.status !== 'pendiente'
      ? null
      : days === 0
        ? 'Enviado hoy'
        : days === 1
          ? 'Hace 1 día sin respuesta'
          : `Hace ${days} días sin respuesta`

  return (
    <li className={`card relative overflow-hidden !p-0 ${isNew ? 'ring-2 ring-ink-600' : ''}`}>
      <span className={`absolute inset-y-0 left-0 w-2 ${st.bar}`} aria-hidden="true" />
      <div className="p-4 pl-6 md:p-5 md:pl-7">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 break-words text-base font-semibold leading-snug">{q.client}</p>
          <StatusBadge status={q.status} />
        </div>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
          <p className="text-2xl font-semibold leading-none">{money(q.amount)}</p>
          <p className="text-sm text-ink-600">Enviado el {fmtDate(q.sentDate)}</p>
        </div>

        {wait && (
          <p
            className={`mt-3 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
              stale ? 'bg-amber-50 text-amber-900 ring-1 ring-amber-300' : 'bg-sand-100 text-ink-700'
            }`}
          >
            {stale && <IconAlert size={14} />}
            {wait}
            {stale && ' · conviene llamar'}
          </p>
        )}

        <Detail q={q} onSave={(patch) => onDetail(q.id, patch)} />

        <div className="mt-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500">Cambiar estado</p>
          <StateButtons q={q} onStatus={onStatus} />
        </div>
      </div>
    </li>
  )
}

/** Detalle opcional según el estado: de qué está pendiente, quién aceptó y firmó, o por qué se rechazó. */
function Detail({ q, onSave }) {
  const [open, setOpen] = useState(false)
  const notes = q.notes || {}
  const [draft, setDraft] = useState({})
  const get = (k) => (k in draft ? draft[k] : k === 'note' ? notes[q.status] || '' : q[k] || '')
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }))
  const label = { pendiente: 'Pendiente de', aceptada: 'Aceptación', rechazada: 'Motivo del rechazo' }[q.status]

  const lines = []
  if (q.status === 'pendiente' && notes.pendiente) lines.push(['Pendiente de', notes.pendiente])
  if (q.status === 'aceptada') {
    if (q.decidedDate) lines.push(['Aceptado el', fmtDate(q.decidedDate)])
    if (q.acceptedBy) lines.push(['Aceptó', q.acceptedBy])
    if (q.signedBy) lines.push(['Firmó', q.signedBy])
    if (notes.aceptada) lines.push(['Nota', notes.aceptada])
  }
  if (q.status === 'rechazada') {
    if (q.decidedDate) lines.push(['Rechazado el', fmtDate(q.decidedDate)])
    if (notes.rechazada) lines.push(['Motivo', notes.rechazada])
  }

  const save = () => {
    const patch = { notes: { [q.status]: get('note').trim() } }
    if (q.status !== 'pendiente') patch.decidedDate = get('decidedDate')
    if (q.status === 'aceptada') {
      patch.acceptedBy = get('acceptedBy').trim()
      patch.signedBy = get('signedBy').trim()
    }
    onSave(patch)
    setDraft({})
    setOpen(false)
  }
  const cancel = () => {
    setDraft({})
    setOpen(false)
  }
  const id = `${q.id}-${q.status}`
  const noteLabel = { pendiente: '¿De qué está pendiente?', aceptada: 'Nota (opcional)', rechazada: '¿Por qué lo rechazó?' }[q.status]

  return (
    <div className="mt-3" data-testid="detalle">
      {!open && (
        <>
          {lines.length > 0 && (
            <dl className="space-y-0.5 rounded-xl bg-sand-100 px-3 py-2 text-sm">
              {lines.map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <dt className="shrink-0 font-semibold text-ink-700">{k}:</dt>
                  <dd className="min-w-0 break-words text-ink-800">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          <button type="button" onClick={() => setOpen(true)} className="mt-1.5 min-h-[40px] text-sm font-semibold text-ink-700 underline underline-offset-2">
            {lines.length ? 'Editar detalle' : `Agregar detalle (${label.toLowerCase()})`}
          </button>
        </>
      )}
      {open && (
        <div className="space-y-3 rounded-xl border-2 border-sand-200 bg-white p-3">
          {q.status !== 'pendiente' && (
            <div>
              <label htmlFor={`${id}-date`} className="label">{q.status === 'aceptada' ? 'Fecha de aceptación' : 'Fecha de rechazo'}</label>
              <input id={`${id}-date`} type="date" className="field" value={get('decidedDate')} onChange={(e) => set('decidedDate', e.target.value)} />
            </div>
          )}
          {q.status === 'aceptada' && (
            <>
              <div>
                <label htmlFor={`${id}-by`} className="label">Quién la aceptó</label>
                <input id={`${id}-by`} className="field" value={get('acceptedBy')} onChange={(e) => set('acceptedBy', e.target.value)} />
              </div>
              <div>
                <label htmlFor={`${id}-sign`} className="label">Quién firmó</label>
                <input id={`${id}-sign`} className="field" value={get('signedBy')} onChange={(e) => set('signedBy', e.target.value)} />
              </div>
            </>
          )}
          <div>
            <label htmlFor={`${id}-note`} className="label">{noteLabel}</label>
            <textarea id={`${id}-note`} rows={2} className="field" value={get('note')} onChange={(e) => set('note', e.target.value)} />
            {QUICK_NOTES[q.status].length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {QUICK_NOTES[q.status].map((t) => (
                  <button key={t} type="button" onClick={() => set('note', t)} className="min-h-[36px] rounded-full border border-sand-200 bg-sand-50 px-3 text-xs font-semibold text-ink-700">
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn-primary !min-h-[44px] flex-1" onClick={save}>Guardar detalle</button>
            <button type="button" className="btn-ghost !min-h-[44px]" onClick={cancel}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}

function StateButtons({ q, onStatus }) {
  return (
    <div className="grid grid-cols-3 gap-1.5" role="group" aria-label={`Estado del presupuesto de ${q.client}`}>
      {STATE_ORDER.map((s) => {
        const on = q.status === s
        return (
          <button
            key={s}
            type="button"
            aria-pressed={on}
            onClick={() => !on && onStatus(q.id, s)}
            className={`min-h-[46px] rounded-xl border-2 px-1 text-sm font-semibold transition ${
              on ? STATE_STYLE[s].on : 'border-sand-200 bg-white text-ink-800 hover:border-ink-500'
            }`}
          >
            {STATES[s].label}
          </button>
        )
      })}
    </div>
  )
}
