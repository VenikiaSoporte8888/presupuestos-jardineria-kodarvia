import { useEffect } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useStore } from './store.jsx'
import { BUSINESS, LOCK_WHOLE_APP } from './config.js'
import { useAuth } from './auth.jsx'
import Gate from './pages/Gate.jsx'
import Listado from './pages/Listado.jsx'
import Nueva from './pages/Nueva.jsx'
import Admin from './pages/Admin.jsx'
import Negocio from './pages/Negocio.jsx'
import InformePage from './pages/InformePage.jsx'
import { IconAlert, IconBuilding, IconList, IconLock, IconPlus, IconReport, IconTree, TreeRow, GrassEdge } from './components/icons.jsx'

const ITEMS = [
  { to: '/', label: 'Presupuestos', Icon: IconList, end: true },
  { to: '/nueva', label: 'Nuevo', Icon: IconPlus },
  { to: '/negocio', label: 'El negocio', Icon: IconBuilding },
  { to: '/informe', label: 'Informe', Icon: IconReport },
  { to: '/admin', label: 'Admin', Icon: IconLock },
]

export default function App() {
  const { storageOk } = useStore()
  const { open: unlocked, lock } = useAuth()
  // Por defecto solo /admin pide clave. Con LOCK_WHOLE_APP, toda la app queda detrás de ella.
  const open = !LOCK_WHOLE_APP || unlocked
  const { pathname } = useLocation()

  // Al cambiar de pantalla, volver siempre arriba del todo.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen">
      <header className="no-print relative bg-ink-800 text-white">
        <TreeRow id="trees-header" height={48} className="pointer-events-none absolute bottom-0 right-0 hidden w-1/2 text-white/10 sm:block" />
        <div className="relative mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lime-300 text-ink-800 shadow-sm">
              <IconTree size={26} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold leading-tight">Control de presupuestos</p>
              <p className="truncate text-xs text-ink-200">{BUSINESS.name}</p>
            </div>
          </div>
          {LOCK_WHOLE_APP && open && (
            <button type="button" onClick={lock} className="order-last inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-ink-100 hover:bg-white/10 md:order-none" aria-label="Bloquear la aplicación">
              <IconLock size={18} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          )}
          <nav className={`${open ? 'hidden md:flex' : 'hidden'} gap-1`} aria-label="Principal">
            {ITEMS.map(({ to, label, Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${
                    isActive ? 'bg-white/20' : 'text-ink-100 hover:bg-white/10'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <GrassEdge id="grass-header" className="no-print -mt-px block text-ink-800" />

      {!storageOk && (
        <div role="alert" className="no-print border-b border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <div className="mx-auto flex max-w-5xl items-start gap-2.5">
            <IconAlert size={20} className="mt-0.5 shrink-0 text-amber-700" />
            <p>
              <strong>Tu navegador tiene bloqueado el guardado de datos.</strong> Puedes usar la app, pero lo que hagas se perderá al
              cerrar o recargar la página.
            </p>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 pb-6 pt-5 md:px-6 md:pt-8">
        {!open ? (
          <Gate whole />
        ) : (
        <Routes>
          <Route path="/" element={<Listado />} />
          <Route path="/presupuestos" element={<Navigate to="/" replace />} />
          <Route path="/nueva" element={<Nueva />} />
          <Route path="/negocio" element={<Negocio />} />
          <Route path="/informe" element={<InformePage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        )}
      </main>

      <div className="no-print pointer-events-none mx-auto max-w-5xl overflow-hidden px-4 pb-24 text-ink-200 md:px-6 md:pb-6" aria-hidden="true">
        <TreeRow id="trees-foot" height={56} />
      </div>

      {open && (
      <nav
        className="no-print safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-sand-200 bg-white shadow-bar md:hidden"
        aria-label="Principal"
      >
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {ITEMS.map(({ to, label, Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex h-16 flex-col items-center justify-center gap-0.5 text-[10px] tracking-tight min-[360px]:text-[11px] min-[360px]:tracking-normal font-semibold ${
                    isActive ? 'text-ink-800' : 'text-ink-500'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`flex h-7 w-12 items-center justify-center rounded-full ${isActive ? 'bg-ink-100' : ''}`}>
                      <Icon size={21} />
                    </span>
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      )}
    </div>
  )
}
