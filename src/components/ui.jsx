import { useState } from 'react'
import { STATES } from '../lib/quotes.js'
import { IconCheck, IconClock, IconX, IconSprout } from './icons.jsx'

/** Colores por estado: nunca solo color, siempre con ícono y texto. */
export const STATE_STYLE = {
  pendiente: {
    bar: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-900 ring-1 ring-amber-300',
    on: 'border-amber-600 bg-amber-500 text-white shadow-md ring-2 ring-amber-300 ring-offset-1',
    tile: 'bg-amber-100 text-amber-950',
    tabOff: 'border-amber-300 bg-amber-50 text-amber-950 hover:border-amber-500',
    text: 'text-amber-600',
    Icon: IconClock,
  },
  aceptada: {
    bar: 'bg-emerald-600',
    badge: 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-300',
    on: 'border-emerald-700 bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300 ring-offset-1',
    tile: 'bg-emerald-100 text-emerald-950',
    tabOff: 'border-emerald-300 bg-emerald-50 text-emerald-950 hover:border-emerald-500',
    text: 'text-emerald-600',
    Icon: IconCheck,
  },
  rechazada: {
    bar: 'bg-rose-600',
    badge: 'bg-rose-50 text-rose-900 ring-1 ring-rose-300',
    on: 'border-rose-700 bg-rose-600 text-white shadow-md ring-2 ring-rose-300 ring-offset-1',
    tile: 'bg-rose-100 text-rose-950',
    tabOff: 'border-rose-300 bg-rose-50 text-rose-950 hover:border-rose-500',
    text: 'text-rose-600',
    Icon: IconX,
  },
}

export function StatusBadge({ status }) {
  const st = STATE_STYLE[status] || STATE_STYLE.pendiente
  const { Icon } = st
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${st.badge}`}>
      <Icon size={14} />
      {STATES[status]?.label || status}
    </span>
  )
}

export function EmptyState({ title, children, action }) {
  return (
    <div className="card mx-auto max-w-md py-10 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-lime-100 text-ink-700">
        <IconSprout size={34} />
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-ink-600">{children}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}

export function Field({ label, required, hint, error, htmlFor, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">
        {label}
        {required ? (
          <>
            {' '}
            <span className="text-rose-600" aria-hidden="true">
              *
            </span>
            <span className="ml-1 text-xs font-medium text-ink-500">(obligatorio)</span>
          </>
        ) : null}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-ink-600">{hint}</p>}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-sm font-semibold text-rose-700">
          {error}
        </p>
      )}
    </div>
  )
}

/** Botón que pide un segundo clic antes de hacer algo irreversible. */
export function ConfirmButton({ label, confirmLabel = 'Sí, confirmar', onConfirm, className = 'btn-danger' }) {
  const [ask, setAsk] = useState(false)
  if (!ask)
    return (
      <button type="button" className={className} onClick={() => setAsk(true)}>
        {label}
      </button>
    )
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        className="btn bg-rose-700 text-white hover:bg-rose-800"
        onClick={() => {
          setAsk(false)
          onConfirm()
        }}
      >
        {confirmLabel}
      </button>
      <button type="button" className="btn-ghost" onClick={() => setAsk(false)}>
        Cancelar
      </button>
    </span>
  )
}
