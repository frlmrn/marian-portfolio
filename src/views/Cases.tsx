import { useEffect, useRef } from 'react'
import { cards, casos, expedientes, pages, ui } from '../content'
import { PageShell } from '../components/PageShell'
import { expedienteHref, Link, matchCase, paths, useRouter } from '../lib/router'
import p from '../components/PageShell.module.css'
import { Clip } from './CasesStage'
import { fotos } from '../components/Polaroid'
import s from './Cases.module.css'

export const href = (id: string) => `${paths.casos}/${id}`

/**
 * Case studies: índice de casos a la izquierda y una carpeta abierta con
 * pestañas 01–03. Cada caso tiene su URL (/casos/<id>); las fotos quedan
 * vacías hasta tener las imágenes definitivas.
 */
/** Caso abierto según la URL, sus vecinos y el foco al cambiar de caso. */
export function useCaso() {
  const { path, navigate } = useRouter()
  const idx = Math.max(
    0,
    casos.findIndex(c => c.id === matchCase(path)),
  )
  const titleRef = useRef<HTMLHeadingElement>(null)
  const first = useRef(true)

  // Al cambiar de caso, el foco pasa al título del caso (lectores de pantalla y teclado)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    titleRef.current?.focus({ preventScroll: true })
  }, [idx])

  const caso = casos[idx]
  const prev = casos[(idx + casos.length - 1) % casos.length]
  const next = casos[(idx + 1) % casos.length]

  // ← y → del teclado pasan de caso (salvo mientras se escribe en un campo)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
      if ((e.target as HTMLElement).closest('input, textarea, select, [role="tab"]')) return
      if (e.key === 'ArrowLeft') navigate(href(prev.id), { scroll: false })
      if (e.key === 'ArrowRight') navigate(href(next.id), { scroll: false })
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [navigate, prev.id, next.id])

  return { caso, card: cards[caso.id], prev, next, titleRef }
}

export function Cases() {
  const { caso, card, prev, next, titleRef } = useCaso()
  const page = pages.casos

  return (
    <PageShell numero={page.numero}>
      <header className={s.top}>
        <h1 className={p.title}>{page.titulo[0]}</h1>
        <p className={`${p.note} ${s.sub}`}>{ui.casos.sub}</p>
      </header>

      <div className={s.layout}>
        <nav className={s.index} aria-label={ui.casos.nav}>
          <p className={s.indexTitle}>{ui.casos.indice}</p>
          <ol>
            {casos.map(c => {
              const active = c.id === caso.id
              return (
                <li key={c.id}>
                  <Link
                    to={href(c.id)}
                    keepScroll
                    className={`${s.indexItem} ${active ? s.active : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span className={s.num}>{cards[c.id].numero}</span>
                    <span>
                      <span className={s.indexName}>{cards[c.id].nombre}</span>
                      <span className={s.indexCat}>{cards[c.id].descripcion}</span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ol>
        </nav>

        <div className={s.folder}>
          {/* Carpeta: tapa azul marino, pestañas y hoja (el paginador queda fuera) */}
          <div className={s.carpeta}>
            <span className={s.tapa} aria-hidden="true" />
            <nav className={s.tabs} aria-label={ui.casos.nav}>
              {casos.map(c => (
                <Link
                  key={c.id}
                  to={href(c.id)}
                  keepScroll
                  className={`${s.tab} ${c.id === caso.id ? s.tabActive : ''}`}
                  aria-current={c.id === caso.id ? 'page' : undefined}
                >
                  <span className={s.num}>{cards[c.id].numero}</span> {cards[c.id].nombre.toUpperCase()}
                </Link>
              ))}
            </nav>

            {/* La key nueva vuelve a lanzar la entrada de la hoja en cada caso */}
            <article key={caso.id} className={s.body} aria-labelledby="caso">
              <div className={s.info}>
                <p className={s.bigNum} aria-hidden="true">
                  {card.numero} /
                </p>
                <h2 id="caso" ref={titleRef} tabIndex={-1} className={s.caseTitle}>
                  {card.nombre}
                </h2>
                <p className={s.cat}>{caso.categoria}</p>
                <p className={s.desc}>{caso.descripcion}</p>
                <ul className={s.claves} aria-label={ui.casos.claves}>
                  {caso.claves.map(k => (
                    <li key={k}>
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>
                {caso.id in expedientes ? (
                  <Link to={expedienteHref(caso.id)} className={s.abrir}>
                    {ui.expediente.abrir}
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
                    </svg>
                  </Link>
                ) : (
                  <p className={s.pending}>{ui.casos.pendiente}</p>
                )}
              </div>

              <div className={s.visual}>
                {/* Foto vacía a la espera de la imagen definitiva del caso */}
                <div className={s.photo}>
                  <div className={s.photoArea}>
                    {(card.imagen ?? fotos[card.id]) && (
                      <img src={card.imagen ?? fotos[card.id]} alt={card.alt ?? ''} />
                    )}
                  </div>
                </div>
                {!(card.imagen ?? fotos[card.id]) && (
                  <div className={`${s.photo} ${s.photoSmall}`} aria-hidden="true">
                    <div className={s.photoArea} />
                    <Clip className={s.clip} />
                  </div>
                )}
                <p className={`${p.note} ${s.caseNote}`}>
                  {caso.nota.map(l => (
                    <span key={l}>{l}</span>
                  ))}
                </p>
              </div>
            </article>
          </div>

          <nav className={s.pager} aria-label={ui.casos.pasar}>
            <Link
              to={href(prev.id)}
              keepScroll
              className={s.arrow}
              aria-label={`${ui.casos.anterior}: ${cards[prev.id].nombre}`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 12H6M11 6.5 5.5 12 11 17.5" />
              </svg>
            </Link>
            <span className={s.count}>
              {card.numero} / {String(casos.length).padStart(2, '0')}
            </span>
            <Link
              to={href(next.id)}
              keepScroll
              className={s.arrow}
              aria-label={`${ui.casos.siguiente}: ${cards[next.id].nombre}`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
              </svg>
            </Link>
          </nav>
        </div>
      </div>
    </PageShell>
  )
}
