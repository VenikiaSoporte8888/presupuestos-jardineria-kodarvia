import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { storage, storageAvailable } from './lib/storage.js'
import { createQuote, withStatus } from './lib/quotes.js'
import { seedQuotes } from './lib/seed.js'

const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)

function loadInitial() {
  // Primera vez: se cargan los datos de ejemplo para verlo funcionando desde el inicio.
  if (!storage.has('quotes')) {
    const quotes = seedQuotes()
    storage.set('quotes', quotes)
    return quotes
  }
  const saved = storage.get('quotes', [])
  return Array.isArray(saved) ? saved : []
}

export function StoreProvider({ children }) {
  const [storageOk] = useState(() => storageAvailable())
  const [quotes, setQuotes] = useState(loadInitial)
  const quotesRef = useRef(quotes)

  // Cada cambio se guarda al instante y actualiza la pantalla sin recargar.
  const commit = useCallback((next) => {
    quotesRef.current = next
    storage.set('quotes', next)
    setQuotes(next)
  }, [])

  const actions = useMemo(
    () => ({
      addQuote(value) {
        const q = createQuote(value)
        commit([q, ...quotesRef.current])
        return q
      },
      setStatus(id, status) {
        commit(quotesRef.current.map((q) => (q.id === id ? withStatus(q, status) : q)))
      },
      updateDetail(id, patch) {
        commit(quotesRef.current.map((q) => (q.id === id ? { ...q, ...patch, notes: { ...q.notes, ...(patch.notes || {}) } } : q)))
      },
      restoreSample() {
        commit(seedQuotes())
      },
      clearAll() {
        commit([])
      },
    }),
    [commit],
  )

  // Referencia siempre actualizada para que las acciones no lean datos viejos.
  quotesRef.current = quotes

  return <Ctx.Provider value={{ quotes, storageOk, ...actions }}>{children}</Ctx.Provider>
}
