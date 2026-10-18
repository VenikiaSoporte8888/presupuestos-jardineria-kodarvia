// Capa fina sobre localStorage. Si el navegador lo bloquea o no lo admite
// (modo privado estricto, cookies bloqueadas, iframe sin permiso), la app sigue
// funcionando con memoria temporal y la interfaz muestra un aviso.
const PREFIX = 'presupuestos-jardineria.v1.'
const memory = new Map()

export function storageAvailable() {
  try {
    const k = PREFIX + '__test'
    window.localStorage.setItem(k, '1')
    window.localStorage.removeItem(k)
    return true
  } catch {
    return false
  }
}

export const storage = {
  has(key) {
    try {
      return window.localStorage.getItem(PREFIX + key) !== null
    } catch {
      return memory.has(key)
    }
  },
  get(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(PREFIX + key)
      if (raw === null) return memory.has(key) ? memory.get(key) : fallback
      return JSON.parse(raw)
    } catch {
      return memory.has(key) ? memory.get(key) : fallback
    }
  },
  set(key, value) {
    memory.set(key, value)
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
      /* sin localStorage: queda solo en memoria */
    }
  },
  remove(key) {
    memory.delete(key)
    try {
      window.localStorage.removeItem(PREFIX + key)
    } catch {
      /* nada */
    }
  },
}
