import { cards, casos, expedientes, pages, ui } from '../content'
import { StageShell } from '../components/StageShell'
import { MiniPolaroid } from '../components/MiniPolaroid'
import { SelloContacto } from '../components/SelloContacto'
import { sagPath, type ThreadDef } from '../components/Threads'
import { box, u } from '../lib/layout'
import { expedienteHref, Link } from '../lib/router'
import { href, useCaso } from './Cases'
import h from './Home.module.css'
import { fotos } from '../components/Polaroid'
import s from './CasesStage.module.css'

/** Clip de papelería, azul marino, que sujeta la foto pequeña. */
export function Clip({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 64" aria-hidden="true">
      <path d="M8 22V8a5 5 0 0 1 10 0v40a8 8 0 0 1-16 0V14" />
    </svg>
  )
}

/* El hilo une la entrada activa del índice con la pestaña del caso abierto */
const threads: ThreadDef[] = [
  {
    id: 'A',
    from: 'idx',
    to: 'tab',
    draw: [0.4, 0.6],
    // de la ficha del índice al borde de la carpeta, a la misma altura: un
    // tramo corto por el hueco entre las dos, sin cruzar ningún texto
    path: (a, b, un, t) => sagPath(a, b, 8 * un * t),
  },
]

/**
 * Reparto del ancho entre el índice y la carpeta, en unidades. En portátiles
 * todo se reduce menos la letra, que no baja de su mínimo: ahí los dos bloques
 * se ensanchan hacia los lados, sin comerse la mesa, para que el texto quepa.
 */
const HUECO = 34
function reparto(unit: number) {
  const maximo = Math.max(1140, innerWidth / unit - 300)
  const indice = Math.max(236, 250 / unit)
  const carpeta = Math.min(Math.max(870, 900 / unit), maximo - indice - HUECO)
  const x = (1536 - indice - HUECO - carpeta) / 2
  return { indice, carpeta, x, xCarpeta: x + indice + HUECO }
}

/**
 * Case studies en escritorio: la mesa común con el índice de casos sujeto a
 * la izquierda y una carpeta abierta en el centro, con pestañas 01–03, la
 * ficha del caso y sus fotos (vacías hasta tener las imágenes).
 */
export function CasesStage({ unit }: { unit: number }) {
  const { caso, card, prev, next, titleRef } = useCaso()
  const page = pages.casos
  const { indice, carpeta, x, xCarpeta } = reparto(unit)

  return (
    <StageShell unit={unit} numero={page.numero} threads={threads} pins={['idx', 'tab']} bocetos="investigacion">
      <header className={s.top} style={box(xCarpeta, 96, carpeta)}>
        <h1 className={s.title}>{page.titulo[0]}</h1>
        <p className={s.sub}>{ui.casos.sub}</p>
      </header>

      {/* Índice de casos y, debajo, los atajos a las otras secciones */}
      <div className={s.lateral} style={{ ...box(x, 196, indice), minHeight: u(620) }}>
        <nav className={s.index} aria-label={ui.casos.nav}>
          <span className={h.cinta} style={{ ...box(70, -16, 92, 32), transform: 'rotate(-4deg)' }} />
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
                    {/* El hilo sale del borde del índice y llega a la carpeta a la misma altura */}
                    {active && <span className={s.anchor} data-anchor="idx" />}
                    {active && <span className={s.anchorCarpeta} data-anchor="tab" />}
                  </Link>
                </li>
              )
            })}
          </ol>
        </nav>
        <div className={s.atajos}>
          <MiniPolaroid id="sobre-mi" giro={-5} style={{ width: `max(104px, ${u(124)})` }} />
          <SelloContacto style={{ width: `max(76px, ${u(96)})`, height: `max(76px, ${u(96)})` }} />
        </div>
      </div>

      {/* Carpeta abierta */}
      <div className={s.folder} style={{ ...box(xCarpeta, 196, carpeta), minHeight: u(620) }}>
        {/* Tapa trasera de la carpeta, azul marino, asomando por detrás de la hoja */}
        <span className={s.tapa} aria-hidden="true" />
        <div className={s.tabs} aria-hidden="true">
          {casos.map(c => {
            const active = c.id === caso.id
            return (
              <Link
                key={c.id}
                to={href(c.id)}
                keepScroll
                tabIndex={-1}
                className={`${s.tab} ${active ? s.tabActive : ''}`}
              >
                <span className={s.num}>{cards[c.id].numero}</span> {cards[c.id].nombre.toUpperCase()}
              </Link>
            )
          })}
        </div>

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
            <div className={s.photo}>
              <div className={s.photoArea}>
                {(card.imagen ?? fotos[card.id]) && <img src={card.imagen ?? fotos[card.id]} alt={card.alt ?? ''} />}
              </div>
            </div>
            {!(card.imagen ?? fotos[card.id]) && (
              <div className={`${s.photo} ${s.photoSmall}`} aria-hidden="true">
                <div className={s.photoArea} />
                <Clip className={s.clip} />
              </div>
            )}
            <p className={s.caseNote}>
              {caso.nota.map(l => (
                <span key={l}>{l}</span>
              ))}
            </p>
          </div>
        </article>

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
    </StageShell>
  )
}
