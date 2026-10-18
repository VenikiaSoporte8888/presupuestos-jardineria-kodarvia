import { BUSINESS } from '../config.js'
import { IconBuilding, IconCheck, IconClock, IconExternal, IconFacebook, IconInstagram, IconPin, IconWhatsApp, IconTree, TreeRow } from '../components/icons.jsx'

const SOCIAL_ICON = { instagram: IconInstagram, facebook: IconFacebook, whatsapp: IconWhatsApp }

export default function Negocio() {
  const b = BUSINESS
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <header className="relative overflow-hidden rounded-2xl bg-ink-800 p-5 pb-16 text-white md:p-6 md:pb-16">
        <TreeRow id="trees-negocio" height={56} className="pointer-events-none absolute inset-x-0 bottom-0 text-lime-300/25" />
        <div className="relative">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-lime-300 text-ink-800">
            <IconTree size={28} />
          </div>
          <h1 className="text-2xl font-semibold leading-tight">{b.name}</h1>
          <p className="mt-1 text-ink-200">{b.tagline}</p>
        </div>
      </header>

      <section className="card space-y-3">
        <h2 className="text-lg font-semibold">A qué nos dedicamos</h2>
        {b.about.map((p) => (
          <p key={p} className="text-ink-700">
            {p}
          </p>
        ))}
        <ul className="grid gap-2 pt-1 sm:grid-cols-2">
          {b.services.map((s) => (
            <li key={s} className="flex items-center gap-2 rounded-xl bg-sand-100 px-3 py-2.5 text-sm font-semibold">
              <IconCheck size={17} className="shrink-0 text-ink-600" />
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="card space-y-3">
        <h2 className="text-lg font-semibold">Cómo llegar</h2>
        <p className="flex items-start gap-2 text-ink-700">
          <IconPin size={20} className="mt-0.5 shrink-0 text-clay-600" />
          {b.address}
        </p>
        <p className="flex items-start gap-2 text-ink-700">
          <IconClock size={20} className="mt-0.5 shrink-0 text-clay-600" />
          {b.hours}
        </p>
        <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-accent w-full sm:w-auto">
          <IconExternal size={18} />
          Abrir en Google Maps
        </a>
      </section>

      <section className="card space-y-3">
        <h2 className="text-lg font-semibold">Síguenos</h2>
        <ul className="grid gap-2">
          {b.socials.map((s) => {
            const Icon = SOCIAL_ICON[s.id] || IconExternal
            return (
              <li key={s.id}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[52px] items-center gap-3 rounded-xl border border-sand-200 px-4 py-2 transition hover:border-ink-500 hover:bg-sand-50"
                >
                  <Icon size={22} className="shrink-0 text-ink-700" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{s.label}</span>
                    <span className="block truncate text-sm text-ink-600">{s.handle}</span>
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </section>

      <p className="text-center text-xs text-ink-500">Datos de ejemplo: se cambian en src/config.js.</p>
    </div>
  )
}
