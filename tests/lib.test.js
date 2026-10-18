import test from 'node:test'
import assert from 'node:assert/strict'
import { countByStatus, inMonth, monthTotals, parseAmount, validateQuote, waitingDays, createQuote } from '../src/lib/quotes.js'
import { seedQuotes } from '../src/lib/seed.js'

const NOW = new Date(2026, 9, 18) // 18 oct 2026

test('los datos de ejemplo traen los tres estados y montos variados', () => {
  const q = seedQuotes(NOW)
  const c = countByStatus(q)
  assert.ok(q.length >= 12)
  assert.ok(c.pendiente > 0 && c.aceptada > 0 && c.rechazada > 0)
  assert.ok(new Set(q.map((x) => x.amount)).size === q.length, 'montos distintos')
  assert.ok(q.some((x) => inMonth(x.sentDate, NOW)), 'hay cotizaciones de este mes')
  assert.ok(q.some((x) => !inMonth(x.sentDate, NOW)), 'y de meses anteriores')
})

test('el total aceptado del mes se recalcula al cambiar un estado', () => {
  const q = [
    { id: 'a', client: 'A', amount: 10000, sentDate: '2026-10-02', status: 'pendiente' },
    { id: 'b', client: 'B', amount: 5000, sentDate: '2026-10-10', status: 'aceptada' },
    { id: 'c', client: 'C', amount: 7000, sentDate: '2026-09-30', status: 'aceptada' }, // otro mes
  ]
  let t = monthTotals(q, NOW)
  assert.equal(t.quoted, 15000)
  assert.equal(t.accepted, 5000)
  q[0] = { ...q[0], status: 'aceptada' }
  t = monthTotals(q, NOW)
  assert.equal(t.accepted, 15000)
  q[1] = { ...q[1], status: 'rechazada' }
  t = monthTotals(q, NOW)
  assert.equal(t.accepted, 10000)
  assert.equal(t.quoted, 15000)
})

test('el formulario no se envía si falta algún campo obligatorio', () => {
  assert.equal(validateQuote({ client: '', amount: '', sentDate: '' }, NOW).ok, false)
  assert.ok(validateQuote({ client: '', amount: '1000', sentDate: '2026-10-01' }, NOW).errors.client)
  assert.ok(validateQuote({ client: 'Ana', amount: '', sentDate: '2026-10-01' }, NOW).errors.amount)
  assert.ok(validateQuote({ client: 'Ana', amount: '1000', sentDate: '' }, NOW).errors.sentDate)
  assert.ok(validateQuote({ client: '   ', amount: '1000', sentDate: '2026-10-01' }, NOW).errors.client)
  assert.ok(validateQuote({ client: 'Ana', amount: '0', sentDate: '2026-10-01' }, NOW).errors.amount)
  assert.ok(validateQuote({ client: 'Ana', amount: '1000', sentDate: '2026-10-19' }, NOW).errors.sentDate, 'fecha futura')
  assert.ok(validateQuote({ client: 'Ana', amount: '1000', sentDate: '2026-02-31' }, NOW).errors.sentDate, 'fecha inexistente')
  const ok = validateQuote({ client: ' Ana ', amount: '18.500 €', sentDate: '2026-10-18' }, NOW)
  assert.equal(ok.ok, true)
  assert.deepEqual(ok.value, { client: 'Ana', amount: 18500, sentDate: '2026-10-18' })
})

test('parseAmount entiende separadores de miles', () => {
  assert.equal(parseAmount('18.500'), 18500)
  assert.equal(parseAmount('18.500 €'), 18500)
  assert.equal(parseAmount('18500'), 18500)
  assert.equal(parseAmount('abc'), 0)
})

test('parseAmount entiende decimales con coma (formato de España)', () => {
  assert.equal(parseAmount('1.250,50'), 1250.5)
  assert.equal(parseAmount('850,5'), 850.5)
  assert.equal(parseAmount('85,25 €'), 85.25)
  assert.equal(parseAmount('1250.50'), 1250.5)
})

test('los importes se muestran en euros con formato de España', async () => {
  const { money, monthTotals } = await import('../src/lib/quotes.js')
  assert.match(money(12500), /^12\.500\s€$/)
  assert.match(money(1250.5), /^1\.250,50\s€$/)
  assert.match(money(850), /^850\s€$/)
  // sumar decimales no arrastra errores de coma flotante
  const now = new Date(2026, 9, 18)
  const t = monthTotals([{ amount: 0.1, status: 'pendiente', sentDate: '2026-10-02' }, { amount: 0.2, status: 'pendiente', sentDate: '2026-10-03' }], now)
  assert.equal(t.quoted, 0.3)
})

test('una cotización nueva nace pendiente', () => {
  assert.equal(createQuote({ client: 'A', amount: 1, sentDate: '2026-10-18' }, NOW).status, 'pendiente')
})

test('días sin respuesta', () => {
  assert.equal(waitingDays('2026-10-18', NOW), 0)
  assert.equal(waitingDays('2026-10-01', NOW), 17)
})

test('al cambiar de estado se anota la fecha y el total aceptado la usa', async () => {
  const { withStatus, createQuote, monthTotals } = await import('../src/lib/quotes.js')
  const now = new Date(2026, 9, 17)
  const q = createQuote({ client: 'Ana', amount: 1000, sentDate: '2026-09-28' })
  const acc = withStatus(q, 'aceptada', now)
  assert.equal(acc.decidedDate, '2026-10-17')
  assert.equal(monthTotals([acc], now).accepted, 1000)
  const back = withStatus(acc, 'pendiente', now)
  assert.equal(back.decidedDate, '')
  assert.equal(monthTotals([back], now).accepted, 0)
  assert.equal(withStatus(acc, 'rechazada', now).decidedDate, '2026-10-17')
})

test('el buscador encuentra por nombre, fecha, monto, estado y firmante', async () => {
  const { matchesQuery } = await import('../src/lib/quotes.js')
  const q = { client: 'Lucía Paredes · Cocina', amount: 38500, sentDate: '2026-10-16', status: 'aceptada', acceptedBy: 'Lucía', signedBy: 'Luis Rojas', notes: { pendiente: '', aceptada: 'Inicio en noviembre', rechazada: '' }, decidedDate: '2026-10-18' }
  for (const t of ['lucia', 'PAREDES cocina', '16/10/2026', '16/10', '2026-10-16', 'oct', 'octubre', '38500', '38,500', '38.500', '38.500 €', 'aceptada', 'luis rojas', 'noviembre']) {
    assert.equal(matchesQuery(q, t), true, t)
  }
  for (const t of ['pendiente', 'maria', '99999', '17/10/2026']) assert.equal(matchesQuery(q, t), false, t)
  assert.equal(matchesQuery(q, ''), true)
})

test('informe mensual: totales, respuestas y meses disponibles', async () => {
  const { monthReport, monthKeys } = await import('../src/lib/quotes.js')
  const q = (id, amount, status, sentDate, decidedDate = '') => ({ id, client: id, amount, status, sentDate, decidedDate, notes: {} })
  const quotes = [
    q('a', 1000, 'aceptada', '2026-09-20', '2026-10-02'),
    q('b', 2000, 'pendiente', '2026-10-05'),
    q('c', 3000, 'rechazada', '2026-10-06', '2026-10-09'),
    q('d', 4000, 'aceptada', '2026-10-07', '2026-10-08'),
    q('e', 500, 'rechazada', '2026-08-01', '2026-08-04'),
  ]
  const r = monthReport(quotes, '2026-10')
  assert.equal(r.sentCount, 3)
  assert.equal(r.quoted, 9000)
  assert.equal(r.acceptedAmount, 5000)
  assert.equal(r.accepted.length, 2)
  assert.equal(r.rejected.length, 1)
  assert.equal(r.pending.length, 1)
  assert.equal(r.rate, 67)
  assert.equal(monthReport(quotes, '2026-07').rate, null)
  assert.deepEqual(monthKeys(quotes, new Date(2026, 9, 17)), ['2026-10', '2026-09', '2026-08'])
})
