// Datos de ejemplo (inventados). Se cargan solo la primera vez que se abre la app.
// Las fechas son relativas a HOY, así que siempre hay presupuestos de este mes y de meses
// anteriores, con importes variados y los tres estados.
import { toISODate, newId } from './quotes.js'

// [cliente, importe en euros, estado, días atrás desde hoy, detalle]
//  aceptada → [días atrás, quién aceptó, quién firmó, nota]
//  detalle: pendiente → de qué está pendiente · aceptada → [días atrás en que aceptó, quién aceptó/firmó, nota]
//           rechazada → [días atrás, motivo]
const SAMPLE = [
  ['Comunidad Los Almendros · Paterna', 3200, 'pendiente', 2, 'Espera la aprobación de la junta de vecinos'],
  ['Familia Ferrer · Chalet Lliria', 1850, 'pendiente', 5, 'Pidió añadir la poda de los pinos'],
  ['Rosa Marín · Jardín adosado Torrent', 640, 'aceptada', 6, [1, 'Rosa Marín', 'Rosa Marín', 'Empezamos la semana que viene']],
  ['Urbanización La Cañada · Mantenimiento anual', 8400, 'aceptada', 9, [4, 'Josefa Pérez', 'Josefa Pérez (administradora)', 'Contrato a partir de enero']],
  ['Restaurante El Olivar · Terraza', 2300, 'pendiente', 12, 'Compara con otra empresa; responden el viernes'],
  ['Vicente Soler · Césped y riego', 4750, 'rechazada', 15, [9, 'Le pareció caro']],
  ['Pilar Gómez · Poda de palmeras', 420, 'pendiente', 19, 'Sin respuesta desde la visita; conviene llamarla'],
  ['Residencial Vistabella · Zonas comunes Paterna', 12600, 'aceptada', 27, [21, 'Antonio Mas', 'Antonio Mas (presidente)', '']],
  ['Clínica Dental Turia · Jardineras de entrada', 960, 'rechazada', 33, [28, 'Eligió a otra empresa']],
  ['Hotel Rural Las Pedrizas · Jardín', 5900, 'pendiente', 38, 'Espera aprobación de la propiedad'],
  ['Familia Navarro · Chalet La Eliana', 3480, 'aceptada', 46, [40, 'Carmen Navarro', 'Carmen Navarro', '']],
  ['Joaquín Ribes · Huerto y frutales', 780, 'rechazada', 55, [50, 'Pospuso el proyecto']],
  ['Flores Pla · Fachada vegetal comercio', 1150, 'pendiente', 62, ''],
  ['Familia Pastor · Parcela Torrent', 6200, 'pendiente', 71, 'Pidió ajustes al presupuesto'],
]

export function seedQuotes(now = new Date()) {
  const ago = (n) => toISODate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - n))
  return SAMPLE.map(([client, amount, status, daysAgo, detail]) => {
    const notes = { pendiente: '', aceptada: '', rechazada: '' }
    let decidedDate = ''
    let signedBy = ''
    let acceptedBy = ''
    if (status === 'pendiente') notes.pendiente = detail || ''
    if (status === 'aceptada') {
      // Las dos aceptaciones más recientes caen siempre dentro del mes actual.
      const k = detail[0] <= 4 ? Math.min(detail[0], now.getDate() - 1) : detail[0]
      decidedDate = ago(k)
      acceptedBy = detail[1]
      signedBy = detail[2]
      notes.aceptada = detail[3] || ''
    }
    if (status === 'rechazada') {
      decidedDate = ago(detail[0])
      notes.rechazada = detail[1]
    }
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo)
    return { id: newId(), client, amount, status, sentDate: toISODate(d), notes, decidedDate, acceptedBy, signedBy, createdAt: d.getTime() }
  })
}
