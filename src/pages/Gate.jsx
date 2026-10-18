import { useState } from 'react'
import { useAuth } from '../auth.jsx'
import { IconLock } from '../components/icons.jsx'

export default function Gate({ whole = false, title }) {
  const { unlock } = useAuth()
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (!unlock(key)) setError('La clave no es correcta.')
  }
  return (
    <div className="mx-auto max-w-sm">
      <form onSubmit={submit} className="card space-y-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink-50 text-ink-800">
          <IconLock size={28} />
        </div>
        <div>
          <h1 className="text-xl font-semibold">{title || (whole ? 'Acceso privado' : 'Panel de administración')}</h1>
          <p className="mt-1 text-sm text-ink-600">{whole ? 'Escribe la clave para entrar a la aplicación.' : 'Escribe la clave para continuar.'}</p>
        </div>
        <div className="text-left">
          <label htmlFor="key" className="label">
            Clave
          </label>
          <input
            id="key"
            className="field"
            type="password"
            autoComplete="off"
            autoFocus
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'key-error' : undefined}
            value={key}
            onChange={(e) => {
              setKey(e.target.value)
              setError('')
            }}
          />
          {error && (
            <p id="key-error" role="alert" className="mt-1.5 text-sm font-semibold text-rose-700">
              {error}
            </p>
          )}
        </div>
        <button type="submit" className="btn-primary w-full">
          Entrar
        </button>
      </form>
    </div>
  )
}
