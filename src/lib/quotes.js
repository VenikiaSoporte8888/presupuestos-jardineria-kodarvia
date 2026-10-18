// Reglas de la app: estados, dinero, fechas, totales del mes y validación del formulario.
// Todo son funciones puras (sin React) para poder probarlas con `npm test`.

export const STATE_ORDER = ['pendiente', 'aceptada', 'rechazada']

export const STATES = {
  pendiente: { label: 'Pendiente', plural: 'Pendientes', hint: 'Esperando respuesta del cliente' },
  aceptada: { label: 'Aceptado', plural: 'Aceptados', hint: 'El cliente aceptó' },
  rechazada: { label: 'Rechazado', plural: 'Rechazados', hint: 'El cliente no lo aceptó' },
}

/** Una presupuesto pendiente lleva "mucho tiempo" sin respuesta a partir de estos días. */
export const STALE_DAYS = 15

const DAY_MS = 86400000
// Euros con formato de España: 12.500 € (los decimales solo aparecen si los hay: 1.250,50 €).
const eur0 = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: 'always' })
const eur2 = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' })
const cents = (n) => Math.round((Number(n) || 0) * 100) / 100

export const money = (n) => {
  const v = cents(n)
  return Number.isInteger(v) ? eur0.format(v) : eur2.format(v)
}

/** 'YYYY-MM-DD' de una fecha local. */
export function toISODate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Convierte 'YYYY-MM-DD' en fecha local (sin saltos por zona horaria). Devuelve null si no es válida. */
export function parseISODate(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''))
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  if (d.getFullYear() !== Number(m[1]) || d.getMonth() !== Number(m[2]) - 1 || d.getDate() !== Number(m[3])) return null
  return d
}

export function fmtDate(s) {
  const d = parseISODate(s)
  return d ? d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
}

export function monthLabel(now = new Date()) {
  return now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
}

/** Días completos desde el envío hasta hoy. */
export function waitingDays(sentDate, now = new Date()) {
  const sent = parseISODate(sentDate)
  if (!sent) return 0
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.max(0, Math.round((today - sent) / DAY_MS))
}

/** ¿El presupuesto se envió en el mismo mes (y año) que `now`? */
export function inMonth(sentDate, now = new Date()) {
  const d = parseISODate(sentDate)
  return !!d && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
}

/**
 * Totales del mes:
 *  - presupuestado: suma de los presupuestos ENVIADOS este mes, sea cual sea su estado.
 *  - aceptado: suma de los presupuestos en estado "aceptada" cuya fecha de aceptación cae este mes
 *    (si no tiene fecha de aceptación, se usa la de envío). Así, al pasar un presupuesto a "Aceptada"
 *    el total sube al instante, y al sacarla de ese estado baja.
 */
export function monthTotals(quotes, now = new Date()) {
  const month = quotes.filter((q) => inMonth(q.sentDate, now))
  const sum = (list) => cents(list.reduce((t, q) => t + (Number(q.amount) || 0), 0))
  const accepted = quotes.filter((q) => q.status === 'aceptada' && inMonth(q.decidedDate || q.sentDate, now))
  return {
    count: month.length,
    quoted: sum(month),
    acceptedCount: accepted.length,
    accepted: sum(accepted),
  }
}

export function countByStatus(quotes) {
  const c = { todas: quotes.length, pendiente: 0, aceptada: 0, rechazada: 0 }
  quotes.forEach((q) => {
    if (c[q.status] !== undefined) c[q.status] += 1
  })
  return c
}

/**
 * Convierte lo que se escribe en euros: "18500", "18.500 €", "1.250,50", "850,5".
 * La coma (o el punto con 1-2 cifras al final) son los decimales; un punto con 3 cifras separa miles.
 */
export function parseAmount(text) {
  const s = String(text ?? '').replace(/[^\d.,]/g, '')
  if (!s) return 0
  const m = s.match(/^(.*?)[.,](\d{1,2})$/)
  const int = (m ? m[1] : s).replace(/[.,]/g, '')
  const n = Number(int + (m ? '.' + m[2] : ''))
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0
}

/**
 * Valida el formulario de alta. Los tres campos son obligatorios.
 * Devuelve { ok, errors, value } y nunca lanza.
 */
export function validateQuote(form, now = new Date()) {
  const errors = {}
  const client = String(form.client ?? '').trim()
  const amount = parseAmount(form.amount)
  const date = parseISODate(form.sentDate)

  if (!client) errors.client = 'Escribe el nombre del cliente.'
  if (!String(form.amount ?? '').trim()) errors.amount = 'Escribe el importe presupuestado.'
  else if (amount <= 0) errors.amount = 'El importe debe ser mayor que cero.'
  if (!String(form.sentDate ?? '').trim()) errors.sentDate = 'Elige la fecha de envío.'
  else if (!date) errors.sentDate = 'La fecha no es válida.'
  else if (date > new Date(now.getFullYear(), now.getMonth(), now.getDate())) errors.sentDate = 'La fecha de envío no puede ser futura.'

  const ok = Object.keys(errors).length === 0
  return { ok, errors, value: ok ? { client, amount, sentDate: form.sentDate } : null }
}

let counter = 0
export const newId = () => `q_${Date.now().toString(36)}_${(counter++).toString(36)}_${Math.random().toString(36).slice(2, 6)}`

export function createQuote(value, now = new Date()) {
  return {
    id: newId(),
    client: value.client,
    amount: value.amount,
    sentDate: value.sentDate,
    status: 'pendiente',
    notes: { pendiente: '', aceptada: '', rechazada: '' },
    decidedDate: '',
    acceptedBy: '',
    signedBy: '',
    createdAt: now.getTime(),
  }
}

/** Cambia el estado. Al aceptar o rechazar se anota la fecha de hoy (se puede corregir después). */
export function withStatus(q, status, now = new Date()) {
  const decided = status === 'pendiente' ? '' : q.decidedDate && q.status !== 'pendiente' ? q.decidedDate : toISODate(now)
  return { ...q, status, decidedDate: decided }
}

/** Motivos rápidos para escribir el detalle con un toque. */
export const QUICK_NOTES = {
  pendiente: ['Esperando respuesta del cliente', 'Pidió ajustes al presupuesto', 'Compara con otra empresa', 'Espera aprobación de la comunidad o de su familia'],
  aceptada: [],
  rechazada: ['Le pareció caro', 'Eligió a otra empresa', 'Pospuso el proyecto', 'No volvió a responder'],
}

const plain = (t) =>
  String(t ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

/** Todo lo que se puede escribir en el buscador para encontrar un presupuesto. */
function searchText(q) {
  const parts = [q.client, q.status, STATES[q.status]?.label, STATES[q.status]?.plural, q.acceptedBy, q.signedBy, ...Object.values(q.notes || {})]
  const dates = [q.sentDate, q.decidedDate].filter(Boolean)
  for (const iso of dates) {
    const x = parseISODate(iso)
    if (!x) continue
    const dd = x.getDate()
    const mm = x.getMonth() + 1
    const yyyy = x.getFullYear()
    parts.push(iso, `${dd}/${mm}/${yyyy}`, `${String(dd).padStart(2, '0')}/${String(mm).padStart(2, '0')}/${yyyy}`, fmtDate(iso))
    parts.push(x.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }))
  }
  return plain(parts.filter(Boolean).join(' | '))
}

/**
 * ¿El presupuesto coincide con lo que se escribió? Cada palabra debe aparecer en alguna parte:
 * cliente, estado, fecha de envío o de aceptación (16/10/2026, 16 oct, octubre, 2026…), quién aceptó o firmó,
 * notas o importe (38500, 38.500, 38.500 €). Sin importar mayúsculas ni tildes.
 */
export function matchesQuery(q, text) {
  const tokens = plain(text).split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return true
  const hay = searchText(q)
  const amount = String(Math.round((Number(q.amount) || 0) * 100) / 100).replace('.', ',')
  return tokens.every((tok) => {
    if (tok === '€') return true
    if (hay.includes(tok)) return true
    const digits = tok.replace(/[^\d]/g, '')
    // Importe: solo si lo escrito parece un importe (tiene separadores, "€" o 3+ dígitos) para no confundirlo con un día.
    return digits.length >= 3 && /^[€.\d,\s]+$/.test(tok) && amount.includes(digits)
  })
}

/** Meses (AAAA-MM) con datos, del más reciente al más antiguo. Siempre incluye el mes actual. */
export function monthKeys(quotes, now = new Date()) {
  const key = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  const set = new Set([key(now)])
  for (const q of quotes) {
    for (const iso of [q.sentDate, q.decidedDate]) {
      const d = parseISODate(iso)
      if (d) set.add(key(d))
    }
  }
  return [...set].sort().reverse()
}

/**
 * Informe de un mes ("AAAA-MM"):
 *  - enviadas: presupuestos enviados ese mes (cualquier estado) y su total presupuestado.
 *  - aceptadas / rechazadas: las que hoy están en ese estado y se decidieron ese mes (fecha de aceptación o rechazo;
 *    si no la tienen, la de envío).
 *  - pendientes: las enviadas ese mes que siguen sin respuesta.
 *  - tasa: aceptadas ÷ (aceptadas + rechazadas), en %, o null si todavía no hay respuestas.
 */
export function monthReport(quotes, key) {
  const [y, m] = key.split('-').map(Number)
  const ref = new Date(y, m - 1, 1)
  const sum = (list) => cents(list.reduce((t, q) => t + (Number(q.amount) || 0), 0))
  const decided = (q) => q.decidedDate || q.sentDate
  const byDate = (get) => (a, b) => (get(a) < get(b) ? 1 : get(a) > get(b) ? -1 : 0)
  const sent = quotes.filter((q) => inMonth(q.sentDate, ref))
  const accepted = quotes.filter((q) => q.status === 'aceptada' && inMonth(decided(q), ref)).sort(byDate(decided))
  const rejected = quotes.filter((q) => q.status === 'rechazada' && inMonth(decided(q), ref)).sort(byDate(decided))
  const pending = sent.filter((q) => q.status === 'pendiente').sort(byDate((q) => q.sentDate))
  const answered = accepted.length + rejected.length
  return {
    key,
    label: monthLabel(ref),
    sentCount: sent.length,
    quoted: sum(sent),
    accepted,
    acceptedAmount: sum(accepted),
    rejected,
    rejectedAmount: sum(rejected),
    pending,
    pendingAmount: sum(pending),
    rate: answered > 0 ? Math.round((accepted.length / answered) * 100) : null,
  }
}
