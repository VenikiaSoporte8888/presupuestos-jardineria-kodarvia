// ─────────────────────────────────────────────────────────────────────────
// Clave del panel /admin. Para cambiarla, edita el texto entre comillas,
// guarda el archivo y vuelve a publicar (o reinicia `npm run dev`).
// OJO: no es autenticación real. La clave viaja dentro del código que descarga
// el navegador; solo sirve para que no entre cualquiera por accidente.
// ─────────────────────────────────────────────────────────────────────────
export const ADMIN_KEY = 'jardin2026'

// ¿Pedir la clave para TODA la app, o solo para /admin?
//  false → (lo que pide el encargo) solo el panel /admin pide clave; el resto de la app se ve sin ella.
//  true  → uso real en un negocio: al abrir la app lo primero es la pantalla de clave y no se ve nada hasta ponerla.
export const LOCK_WHOLE_APP = false

// ¿Mostrar la lista de presupuestos al abrir la app?
//  false → pantalla limpia: primero se ve solo el menú (Todos / Pendientes / Aceptados / Rechazados) y la lista aparece al tocar
//          un estado o al buscar.
//  true  → la lista completa aparece desde el inicio y el menú de estados solo filtra.
export const LIST_OPEN_BY_DEFAULT = false

// Datos del negocio para la página informativa. TODO ESTO ES DE EJEMPLO:
// reemplázalo por los datos reales de la empresa de jardinería.
export const BUSINESS = {
  name: 'Jardinería Lliria Verde',
  tagline: 'Jardinería y mantenimiento de espacios verdes desde hace más de 20 años',
  about: [
    'Somos una empresa familiar de jardinería con más de 20 años de experiencia. Diseñamos, plantamos y mantenemos jardines, comunidades de vecinos y comercios.',
    'Trabajamos en Lliria, Torrent, Paterna y otras zonas de Valencia. Cada presupuesto empieza con una visita sin compromiso.',
  ],
  services: ['Diseño y plantación', 'Mantenimiento de comunidades', 'Poda y tala', 'Riego automático y césped'],
  address: 'Calle Mayor 12, 46160 Lliria, Valencia, España',
  hours: 'Lunes a viernes de 8:00 a 14:00 y de 16:00 a 19:00 · Sábados de 9:00 a 13:00',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Calle+Mayor+12+46160+Lliria+Valencia',
  socials: [
    { id: 'instagram', label: 'Instagram', handle: '@jardineria.lliria', url: 'https://www.instagram.com/' },
    { id: 'facebook', label: 'Facebook', handle: 'Jardinería Lliria Verde', url: 'https://www.facebook.com/' },
    { id: 'whatsapp', label: 'WhatsApp', handle: '+34 600 000 000', url: 'https://wa.me/34600000000' },
  ],
}
