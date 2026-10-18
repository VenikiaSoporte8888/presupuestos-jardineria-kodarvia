import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { ADMIN_KEY } from './config.js'

// Acceso a toda la app: mientras no se ponga la clave no se muestra nada (ni presupuestos, ni totales).
// La sesión vive en sessionStorage: al cerrar la pestaña hay que volver a poner la clave.
// OJO: no es autenticación real, solo evita que entre cualquiera por accidente.
const SESSION_KEY = 'presupuestos-jardineria.admin'
const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

const readSession = () => {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function AuthProvider({ children }) {
  const [open, setOpen] = useState(readSession)

  const unlock = useCallback((key) => {
    if (key !== ADMIN_KEY) return false
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      /* sin sessionStorage: la sesión queda solo en memoria */
    }
    setOpen(true)
    return true
  }, [])

  const lock = useCallback(() => {
    try {
      window.sessionStorage.removeItem(SESSION_KEY)
    } catch {
      /* nada */
    }
    setOpen(false)
  }, [])

  const value = useMemo(() => ({ open, unlock, lock }), [open, unlock, lock])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
