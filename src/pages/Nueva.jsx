import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { toISODate, validateQuote } from '../lib/quotes.js'
import { Field } from '../components/ui.jsx'

export default function Nueva() {
  const { addQuote } = useStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ client: '', amount: '', sentDate: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const today = toISODate(new Date())

  const change = (patch) => {
    const next = { ...form, ...patch }
    setForm(next)
    // Tras un primer intento, los errores se corrigen en vivo.
    if (submitted) setErrors(validateQuote(next).errors)
  }

  const submit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    const res = validateQuote(form)
    setErrors(res.errors)
    if (!res.ok) {
      // Lleva el cursor al primer campo con error.
      const first = ['client', 'amount', 'sentDate'].find((k) => res.errors[k])
      document.getElementById(first)?.focus()
      return
    }
    const q = addQuote(res.value)
    navigate('/', { state: { saved: q.client, savedId: q.id } })
  }

  const errCount = Object.keys(errors).length
  const props = (id) => ({
    id,
    'aria-invalid': errors[id] ? 'true' : 'false',
    'aria-describedby': errors[id] ? `${id}-error` : undefined,
  })

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold leading-tight">Nuevo presupuesto</h1>
        <p className="mt-1 text-ink-600">
          Los campos con <span className="font-semibold text-rose-600">*</span> son obligatorios.
        </p>
      </div>

      <form onSubmit={submit} noValidate className="card space-y-5">
        {submitted && errCount > 0 && (
          <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
            Faltan datos: revisa los campos marcados en rojo.
          </p>
        )}

        <Field label="Cliente" required htmlFor="client" error={errors.client}>
          <input
            {...props('client')}
            className="field"
            type="text"
            autoComplete="off"
            placeholder="Ej: Comunidad Los Almendros · Paterna"
            value={form.client}
            onChange={(e) => change({ client: e.target.value })}
          />
        </Field>

        <Field label="Importe presupuestado (en euros)" required htmlFor="amount" error={errors.amount} hint="Solo números. Si quieres, con decimales: 1.250,50">
          <div className="relative">
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-semibold text-ink-600">€</span>
            <input
              {...props('amount')}
              className="field !pr-10"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="1250"
              value={form.amount}
              onChange={(e) => change({ amount: e.target.value })}
            />
          </div>
        </Field>

        <Field label="Fecha de envío" required htmlFor="sentDate" error={errors.sentDate}>
          <div className="flex gap-2">
            <input
              {...props('sentDate')}
              className="field"
              type="date"
              max={today}
              value={form.sentDate}
              onChange={(e) => change({ sentDate: e.target.value })}
            />
            <button type="button" className="btn-ghost shrink-0" onClick={() => change({ sentDate: today })}>
              Hoy
            </button>
          </div>
        </Field>

        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <Link to="/" className="btn-ghost">
            Cancelar
          </Link>
          <button type="submit" className="btn-primary">
            Guardar presupuesto
          </button>
        </div>
        <p className="text-xs text-ink-600">El presupuesto se guarda como “Pendiente”. Después puedes cambiar su estado con un clic.</p>
      </form>
    </div>
  )
}
