const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

function Svg({ size = 22, className = '', children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} {...base}>
      {children}
    </svg>
  )
}

export const IconList = (p) => (
  <Svg {...p}>
    <path d="M9 6h11M9 12h11M9 18h11" />
    <path d="M4 6h.01M4 12h.01M4 18h.01" />
  </Svg>
)
export const IconPlus = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)
export const IconBuilding = (p) => (
  <Svg {...p}>
    <path d="M4 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17M15 9h4a1 1 0 0 1 1 1v11M3 21h18" />
    <path d="M8 7h3M8 11h3M8 15h3" />
  </Svg>
)
export const IconLock = (p) => (
  <Svg {...p}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Svg>
)
export const IconCheck = (p) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
)
export const IconX = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
)
export const IconClock = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
)
export const IconPin = (p) => (
  <Svg {...p}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Svg>
)
export const IconAlert = (p) => (
  <Svg {...p}>
    <path d="M12 3l10 18H2L12 3z" />
    <path d="M12 10v5M12 18h.01" />
  </Svg>
)
export const IconSearch = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Svg>
)
export const IconExternal = (p) => (
  <Svg {...p}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </Svg>
)
export const IconInstagram = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17 7h.01" />
  </Svg>
)
export const IconFacebook = (p) => (
  <Svg {...p}>
    <path d="M14 8h2.5V4.5H14A4 4 0 0 0 10 8.5V11H7.5v3.5H10V21h3.5v-6.5H16l.5-3.5h-3V8.7c0-.4.3-.7.7-.7z" />
  </Svg>
)
export const IconWhatsApp = (p) => (
  <Svg {...p}>
    <path d="M4 20l1.3-4.2A8 8 0 1 1 8.3 18.8L4 20z" />
    <path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 .7c-.8-.4-1.6-1.2-2-2l.7-1-1-2L9 9z" />
  </Svg>
)
export const IconRefresh = (p) => (
  <Svg {...p}>
    <path d="M20 12a8 8 0 1 1-2.4-5.7M20 4v5h-5" />
  </Svg>
)
export const IconTrash = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  </Svg>
)

export const IconReport = (p) => (
  <Svg {...p}>
    <path d="M7 3h7l4 4v14H7z" />
    <path d="M14 3v4h4M10 12h5M10 16h5" />
  </Svg>
)

// ── Jardinería ─────────────────────────────────────────────────────────────
export const IconTree = (p) => (
  <Svg {...p}>
    <path d="M12 21v-6" />
    <path d="M12 15c-3.6 0-6-2.3-6-5.2 0-1.4.6-2.6 1.6-3.4C8 4.6 9.7 3 12 3s4 1.6 4.4 3.4c1 .8 1.6 2 1.6 3.4 0 2.9-2.4 5.2-6 5.2z" />
  </Svg>
)
export const IconSprout = (p) => (
  <Svg {...p}>
    <path d="M12 21v-9" />
    <path d="M12 12c0-4 2.6-6.5 7-6.5 0 4.2-2.6 6.5-7 6.5z" />
    <path d="M12 14.5c0-3.2-2.2-5.2-6-5.2 0 3.4 2.3 5.2 6 5.2z" />
  </Svg>
)
export const IconLeaf = (p) => (
  <Svg {...p}>
    <path d="M5 19c0-9 5-14 15-14 0 9-5 14-13 14" />
    <path d="M5 19c3-4 6-6.5 10-8" />
  </Svg>
)

/**
 * Paisaje de árboles (cipreses, pinos, árboles redondos y arbustos) que se repite en horizontal.
 * Solo decoración: usa el color del texto (currentColor), así se tiñe desde fuera con una clase `text-…`.
 */
export function TreeRow({ id = 'trees', height = 56, className = '' }) {
  return (
    <svg width="100%" height={height} aria-hidden="true" className={className} focusable="false">
      <defs>
        <pattern id={id} width="230" height="56" patternUnits="userSpaceOnUse">
          <g fill="currentColor">
            <ellipse cx="14" cy="30" rx="7" ry="24" />
            <rect x="12.5" y="46" width="3" height="10" />
            <circle cx="52" cy="30" r="15" />
            <rect x="50" y="40" width="4" height="16" />
            <path d="M92 4 104 24h-6l9 14H77l9-14h-6z" />
            <rect x="90" y="38" width="4" height="18" />
            <path d="M118 56a10 10 0 0 1 12-9 10 10 0 0 1 14-2 10 10 0 0 1 10 11z" />
            <circle cx="180" cy="32" r="12" />
            <rect x="178" y="40" width="4" height="16" />
            <ellipse cx="212" cy="32" rx="6" ry="22" />
            <rect x="210.5" y="48" width="3" height="8" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${id})`} />
    </svg>
  )
}

/** Borde de hierba: se pone justo debajo de una franja de color (usa currentColor). */
export function GrassEdge({ id = 'grass', className = '' }) {
  return (
    <svg width="100%" height="14" aria-hidden="true" className={className} focusable="false">
      <defs>
        <pattern id={id} width="26" height="14" patternUnits="userSpaceOnUse">
          <path fill="currentColor" d="M0 0h26v2l-2.5 11-3.5-9-3 9.5-3.5-10-3.5 10.5-3-9.5-3 8.5z" />
        </pattern>
      </defs>
      <rect width="100%" height="14" fill={`url(#${id})`} />
    </svg>
  )
}
