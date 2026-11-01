import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import lapiz from '../assets/decor/lapiz-marino.webp'
import { cards, casos, expedientes, pages, ui } from '../content'
import { PageShell } from '../components/PageShell'
import { Fichas, Huellas, type Ficha } from '../components/Archivo'
import { CatPaw } from '../components/CatPaw'
import { Contrastes, Lamina } from '../components/Diagramas'
import { Garabatos } from '../components/Garabatos'
import { Threads, type Pt, type ThreadDef } from '../components/Threads'
import { expedienteHref, Link, paths, urlPublica } from '../lib/router'
import { href } from './Cases'
import a from '../components/Archivo.module.css'
import p from '../components/PageShell.module.css'
import s from './Expediente.module.css'

/** Pantallas de cada caso (capturas del prototipo real), por clave. */
const pantallas = import.meta.glob<string>('../assets/casos/*/{pant,logo}-*.webp', { eager: true, import: 'default' })
const pantalla = (caso: string, k: string) =>
  pantallas[`../assets/casos/${caso}/${k.startsWith('logo-') ? k : `pant-${k}`}.webp`]

/** Las piezas aparecen al llegar a ellas al bajar (se deslizan un poco y se asientan). */
function useRevela() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const raiz = ref.current
    if (!raiz) return
    const io = new IntersectionObserver(
      entradas =>
        entradas.forEach(en => {
          if (!en.isIntersecting) return
          en.target.classList.add(s.vista)
          io.unobserve(en.target)
        }),
      { threshold: 0.12 },
    )
    raiz.querySelectorAll('[data-revela]').forEach(el => io.observe(el))
    return () => io.disconnect()
  })
  return ref
}

/*
 * El hilo rojo une las partes del expediente de chincheta en chincheta: sale
 * de la hoja de portada y pasa por el título de cada parte. Va por el margen
 * izquierdo de la mesa, así nunca cruza un texto.
 */
const PINES = ['e0', 'e1', 'e2', 'e3', 'e4']
const porMargen = (desde: Pt, hasta: Pt) => {
  // los puntos son relativos a la mesa: el hueco libre es lo que hay entre la mesa y el borde del papel
  const hueco = document.querySelector(`.${s.mesa}`)?.getBoundingClientRect().left ?? 40
  const x = Math.min(desde.x, hasta.x) - Math.min(72, Math.max(8, hueco - 20))
  return `M${desde.x} ${desde.y}C${x} ${desde.y + 70} ${x} ${hasta.y - 70} ${hasta.x} ${hasta.y}`
}
const HILOS: ThreadDef[] = PINES.slice(1).map((id, i) => ({
  id: `h${i}`,
  from: PINES[i],
  to: id,
  draw: [0.6 + i * 0.25, 1.2],
  path: porMargen,
}))

function Probar({ url }: { url: string }) {
  return (
    <a className={`${p.button} ${s.probar}`} href={url} target="_blank" rel="noopener noreferrer">
      {ui.expediente.probar}
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
    </a>
  )
}

/** Título de cada parte, en un recorte de papel con cinta y la chincheta del hilo. */
function Titulo({ id, n, children }: { id: string; n: number; children: ReactNode }) {
  return (
    <h2 id={id} className={s.titulo} data-revela>
      <span className={`${p.tape} ${s.tituloCinta}`} />
      <span className={s.ancla} data-anchor={`e${n}`} />
      <span className={s.tituloNum}>{String(n).padStart(2, '0')}</span>
      {children}
    </h2>
  )
}

/** Post-it con un texto corto. */
function Nota({ children, giro = 0, className = '' }: { children: ReactNode; giro?: number; className?: string }) {
  return (
    <div className={`${s.postit} ${className}`} style={{ '--giro': `${giro}deg` } as CSSProperties} data-revela>
      {children}
    </div>
  )
}

/** Móvil dibujado (marco, isla y pantalla) con una captura del prototipo. */
function Movil({
  src,
  alt,
  giro = 0,
  className = '',
}: {
  src: string
  alt: string
  giro?: number
  className?: string
}) {
  return (
    <span className={`${s.movil} ${className}`} style={{ rotate: `${giro}deg` }}>
      <span className={s.pantallaMovil}>
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </span>
    </span>
  )
}

/** Portátil dibujado con una captura de escritorio. */
function Portatil({ src, alt }: { src: string; alt: string }) {
  return (
    <span className={s.portatil}>
      <span className={s.portatilPantalla}>
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </span>
      <span className={s.portatilBase} />
    </span>
  )
}

/**
 * Móvil con el prototipo de verdad dentro (iframe a 390 × 844, escalado al
 * marco). Se enciende al pulsar, para no cargarlo si nadie lo usa.
 */
function MovilVivo({ url, titulo }: { url: string; titulo: string }) {
  const [on, setOn] = useState(false)
  const caja = useRef<HTMLSpanElement>(null)
  const [k, setK] = useState(0.7)
  useEffect(() => {
    const el = caja.current
    if (!el) return
    const ro = new ResizeObserver(() => setK(el.clientWidth / 390))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div className={`${s.movil} ${s.movilVivo}`}>
      <span ref={caja} className={s.pantallaMovil}>
        {on ? (
          <iframe src={url} title={titulo} loading="lazy" style={{ transform: `scale(${k})` }} />
        ) : (
          <button type="button" className={s.encender} onClick={() => setOn(true)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v8M6.3 6.8a8 8 0 1 0 11.4 0" />
            </svg>
            {ui.expediente.encender}
          </button>
        )}
      </span>
    </div>
  )
}

/** Portátil con el prototipo de verdad dentro (iframe a 1440 × 900, escalado a la pantalla). */
function PortatilVivo({ url, titulo }: { url: string; titulo: string }) {
  const [on, setOn] = useState(false)
  const caja = useRef<HTMLSpanElement>(null)
  const [k, setK] = useState(0.4)
  useEffect(() => {
    const el = caja.current
    if (!el) return
    const ro = new ResizeObserver(() => setK(el.clientWidth / 1440))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div className={`${s.portatil} ${s.portatilVivo}`}>
      <span className={s.portatilPantalla}>
        <span ref={caja} className={s.pantallaWeb}>
          {on ? (
            <iframe src={url} title={titulo} loading="lazy" style={{ transform: `scale(${k})` }} />
          ) : (
            <button type="button" className={s.encender} onClick={() => setOn(true)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3v8M6.3 6.8a8 8 0 1 0 11.4 0" />
              </svg>
              {ui.expediente.encender}
            </button>
          )}
        </span>
      </span>
      <span className={s.portatilBase} />
    </div>
  )
}

/** Mockup de portada: un portátil con un móvil delante, o tres móviles en abanico. */
function Mockup({
  caso,
  mockup,
  alt,
}: {
  caso: string
  mockup: { portatil?: string; moviles: string[] }
  alt: (k: string) => string
}) {
  if (mockup.portatil)
    return (
      <div className={s.mockupPortatil}>
        <Portatil src={pantalla(caso, mockup.portatil)} alt={alt(mockup.portatil)} />
        {mockup.moviles[0] && (
          <Movil
            src={pantalla(caso, mockup.moviles[0])}
            alt={alt(mockup.moviles[0])}
            giro={-3}
            className={s.movilDelante}
          />
        )}
      </div>
    )
  return (
    <div className={s.mockupMoviles}>
      {mockup.moviles.map((k, i) => (
        <Movil key={k} src={pantalla(caso, k)} alt={alt(k)} giro={[-7, 0, 7][i % 3]} />
      ))}
    </div>
  )
}

/** Paso a paso: móviles con la pantalla de cada paso y su etiqueta numerada. */
/**
 * Lista de pantallas que en el móvil se convierte en carrusel: se desliza de
 * lado (con imán) y debajo lleva flechas y un punto por pantalla. En pantallas
 * anchas las flechas y los puntos no se ven y la lista es una rejilla.
 */
function Carrusel({ className, children }: { className: string; children: ReactNode[] }) {
  const ref = useRef<HTMLOListElement>(null)
  const [actual, setActual] = useState(0)
  const t = ui.expediente
  const n = children.length

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const alMover = () => {
      const centro = el.scrollLeft + el.clientWidth / 2
      let mejor = 0
      let dist = Infinity
      Array.from(el.children).forEach((k, j) => {
        const h = k as HTMLElement
        const d = Math.abs(h.offsetLeft + h.offsetWidth / 2 - centro)
        if (d < dist) {
          dist = d
          mejor = j
        }
      })
      setActual(mejor)
    }
    el.addEventListener('scroll', alMover, { passive: true })
    return () => el.removeEventListener('scroll', alMover)
  }, [])

  const ir = (j: number) => {
    const el = ref.current
    const k = el?.children[Math.max(0, Math.min(n - 1, j))] as HTMLElement | undefined
    if (!el || !k) return
    const suave = !matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: k.offsetLeft - (el.clientWidth - k.offsetWidth) / 2, behavior: suave ? 'smooth' : 'auto' })
  }

  return (
    <div className={s.carrusel}>
      <ol ref={ref} className={className}>
        {children}
      </ol>
      <div className={s.carruselControles}>
        <button type="button" className={s.carruselFlecha} onClick={() => ir(actual - 1)} disabled={actual === 0} aria-label={t.pasoAnterior}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 12H6M11 6.5 5.5 12 11 17.5" />
          </svg>
        </button>
        <span className={s.carruselPuntos}>
          {children.map((_, j) => (
            <button
              key={j}
              type="button"
              className={j === actual ? s.puntoActual : ''}
              onClick={() => ir(j)}
              aria-label={t.irPaso(j + 1)}
              aria-current={j === actual ? 'true' : undefined}
            />
          ))}
        </span>
        <button type="button" className={s.carruselFlecha} onClick={() => ir(actual + 1)} disabled={actual === n - 1} aria-label={t.pasoSiguiente}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function Pasos({
  pasos,
  img,
  alt,
}: {
  pasos: { img: string; titulo: string; texto: string }[]
  img: (k: string) => string
  alt: (k: string) => string
}) {
  return (
    <Carrusel className={s.pasos}>
      {pasos.map((ps, i) => (
        <li key={ps.img} className={s.paso} data-revela>
          <Movil src={img(ps.img)} alt={alt(ps.img)} giro={[-1.5, 1, -0.6, 1.4, -1, 0.8][i % 6]} />
          <div className={s.pasoNota}>
            <span className={s.pasoNum}>{String(i + 1).padStart(2, '0')}</span>
            <p className={s.pasoTit}>{ps.titulo}</p>
            <p className={s.pasoTexto}>{ps.texto}</p>
          </div>
        </li>
      ))}
    </Carrusel>
  )
}

/** Objetos de la mesa relacionados con cada caso, en el margen (decorativos). */
function Objetos({ id }: { id: string }) {
  if (id === 'ohmycat')
    return (
      <div className={s.objetos} aria-hidden="true">
        <div className={s.huellas}>
          <Huellas
            pasos={[
              { x: 0, y: 0, r: 160 },
              { x: 34, y: 54, r: 168 },
              { x: 2, y: 112, r: 158 },
              { x: 38, y: 168, r: 170 },
              { x: 6, y: 226, r: 162 },
            ]}
          />
        </div>
        <CatPaw className={s.pata} withHint />
      </div>
    )
  return (
    <div className={s.objetos} aria-hidden="true">
      <img className={s.lapiz} src={lapiz} alt="" />
    </div>
  )
}

/**
 * Expediente completo de un caso, con el orden de los portfolios de UX:
 * cabecera, contexto y reto, investigación, solución (cómo funciona, el
 * prototipo en vivo, decisiones y guía de estilo) y resultados. Todo en objetos de archivo unidos por el hilo rojo; los diagramas
 * se dibujan a partir del Figma. Nada inventado.
 */
export function Expediente({ id }: { id: string }) {
  const e = expedientes[id]
  const card = cards[id as keyof typeof cards]
  const raiz = useRevela()
  if (!e || !card) return null
  const t = ui.expediente
  const alt = (k: string) => e.alt[k] ?? ''
  const img = (k: string) => pantalla(id, k)
  const inv = e.investigacion
  const sol = e.solucion

  const orden = casos.map(c => c.id)
  // Casos vecinos, en el orden de la carpeta: su expediente si lo tiene, si no su ficha
  const pos = orden.indexOf(id as (typeof orden)[number])
  const vecino = (paso: number) => {
    const vid = orden[(pos + paso + orden.length) % orden.length]
    return { card: cards[vid], href: vid in expedientes ? expedienteHref(vid) : href(vid) }
  }
  const ant = vecino(-1)
  const sig = vecino(1)

  const personas: Ficha[] = (inv.personas ?? []).map(pe => ({
    id: pe.nombre,
    label: `${pe.nombre}: ${pe.perfil}`,
    tab: (
      <>
        <span className={a.tabYear}>{pe.nombre}</span>
        <span className={a.tabSub}>{pe.perfil.split(' · ')[0]}</span>
      </>
    ),
    body: (
      <div className={s.fichaPersona}>
        <p className={s.personaPerfil}>{pe.perfil}</p>
        <p className={s.etq}>{t.objetivo}</p>
        <p>{pe.objetivo}</p>
        <p className={s.etq}>{t.frustracion}</p>
        <p>{pe.frustracion}</p>
        <p className={s.personaCita}>«{pe.cita}»</p>
      </div>
    ),
  }))

  // Las mismas decisiones en el fichero: pestaña con número y nombre, y la ficha con su título
  const decisiones: Ficha[] = e.cambios.items.map((it, i) => ({
    id: it.tab,
    label: it.tab,
    tab: (
      <>
        <span className={a.tabYear}>{String(i + 1).padStart(2, '0')}</span>
        <span className={a.tabSub}>{it.tab}</span>
      </>
    ),
    body: (
      <>
        <p className={s.decisionTit}>{it.tab}</p>
        <div className={s.antesDespues}>
          <div>
            <p className={s.etq}>{t.antes}</p>
            <p className={s.antes}>{it.antes}</p>
          </div>
          <svg className={s.flecha} viewBox="0 0 40 20" aria-hidden="true">
            <path d="M2 10 H36 M30 4 L36 10 L30 16" />
          </svg>
          <div>
            <p className={`${s.etq} ${s.etqMarino}`}>{t.despues}</p>
            <p>{it.despues}</p>
          </div>
        </div>
      </>
    ),
  }))

  const cambios: Ficha[] = e.cambios.items.map(it => ({
    id: it.tab,
    label: it.tab,
    tab: <span className={a.tabGrupo}>{it.tab}</span>,
    body: (
      <div className={s.antesDespues}>
        <div>
          <p className={s.etq}>{t.antes}</p>
          <p className={s.antes}>{it.antes}</p>
        </div>
        <svg className={s.flecha} viewBox="0 0 40 20" aria-hidden="true">
          <path d="M2 10 H36 M30 4 L36 10 L30 16" />
        </svg>
        <div>
          <p className={`${s.etq} ${s.etqMarino}`}>{t.despues}</p>
          <p>{it.despues}</p>
        </div>
      </div>
    ),
  }))

  return (
    <PageShell numero={pages.casos.numero}>
      <div ref={raiz} className={s.mesa}>
        <Garabatos items={e.garabatos} />
        <Objetos id={id} />

        <nav className={s.migas} aria-label={t.migas}>
          <Link to={href(id)} className={s.volver}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 12H6M11 6.5 5.5 12 11 17.5" />
            </svg>
            {t.volver}
          </Link>
        </nav>

        {/* ——— Cabecera ——— */}
        <header className={s.portada}>
          <div className={s.hoja}>
            <span className={p.tape} style={{ left: '12%', top: -14, width: 100, height: 30, rotate: '-5deg' }} />
            <span className={`${s.ancla} ${s.anclaHoja}`} data-anchor="e0" />
            <p className={s.rotulo}>
              {t.expediente} {card.numero}
            </p>
            <h1 className={s.h1}>{card.nombre}</h1>
            <p className={s.categoria}>{e.categoria}</p>
            <p className={s.lead}>{e.lead}</p>
            <dl className={s.meta}>
              {e.ficha.map(f => (
                <div key={f.k}>
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
            <Probar url={urlPublica(e.prototipo)} />
          </div>
          <div className={s.portadaFotos}>
            <Mockup caso={id} mockup={sol.mockup} alt={alt} />
            <div className={s.resultadoPortada}>
              <Nota giro={-3}>
                <p className={s.etqNota}>{t.resultadoEtq}</p>
                <p className={s.postitTit}>{e.resultado}</p>
              </Nota>
            </div>
          </div>
        </header>

        {/* ——— 01 Contexto y reto ——— */}
        <section className={s.parte} aria-labelledby="reto">
          <Titulo id="reto" n={1}>
            {e.reto.titulo}
          </Titulo>
          <div className={s.encargo}>
            <div className={s.reto} data-revela>
              <span className={p.tape} style={{ right: '14%', top: -12, width: 80, height: 26, rotate: '4deg' }} />
              {e.reto.texto.map(x => (
                <p key={x}>{x}</p>
              ))}
              <p className={s.objetivo}>
                <span className={s.etq}>{t.objetivoEtq}</span>
                {e.reto.objetivo}
              </p>
            </div>
            {e.reto.cita && (
              <Nota giro={3} className={s.cita}>
                <p className={s.postitTit}>«{e.reto.cita.texto}»</p>
                <p className={s.postitNota}>— {e.reto.cita.autor}</p>
              </Nota>
            )}
          </div>
          {e.reto.referencia && (
            <div className={s.referencia}>
              <div className={s.nota} data-revela>
                <span className={`${s.compararEtq} ${s.compararAntes}`}>{t.referencia}</span>
                <p>{e.reto.referencia.nota}</p>
              </div>
              <div className={s.referenciaMoviles}>
                {e.reto.referencia.imgs.map((k, n) => (
                  <div key={k} data-revela>
                    <Movil src={img(k)} alt={alt(k)} giro={[-3, 2.5][n % 2]} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ——— 02 Investigación ——— */}
        <section className={s.parte} aria-labelledby="investigacion">
          <Titulo id="investigacion" n={2}>
            {inv.titulo}
          </Titulo>
          <div className={s.investigacion}>
            <div className={s.nota} data-revela>
              <p>{inv.nota}</p>
              <ul className={s.dymo} aria-label={t.metodos}>
                {inv.metodos.map(m => (
                  <li key={m}>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
            {personas.length > 0 && (
              <div className={s.cajon} data-revela>
                <Fichas variante="cajon" fichas={personas} alto="22.5em">
                  <span className={a.portaEtiqueta}>
                    <span>{t.cajonPersonas}</span>
                  </span>
                  <span className={a.tirador} />
                </Fichas>
              </div>
            )}
          </div>
          <ul className={`${s.hallazgos} ${s.hallazgosAnchos}`} aria-label={t.hallazgos}>
            {inv.hallazgos.map((h, i) => (
              <li key={h}>
                <Nota giro={[-2.4, 1.6, -1, 2.2, -1.8, 1.2][i % 6]}>{h}</Nota>
              </li>
            ))}
          </ul>
          <div className={s.diagramas}>
            {inv.diagramas.map((d, i) => (
              <Lamina key={d.titulo} d={d} giro={[-0.5, 0.6, -0.4][i % 3]} />
            ))}
          </div>
        </section>

        {/* ——— 03 La solución ——— */}
        <section className={s.parte} aria-labelledby="solucion">
          <Titulo id="solucion" n={3}>
            {sol.titulo}
          </Titulo>
          <div className={s.nota} data-revela style={{ maxWidth: '40em' }}>
            <p>{sol.nota}</p>
          </div>

          {sol.web && (
            <>
              <h3 className={s.subtitulo} data-revela>
                {sol.web.titulo}
              </h3>
              {sol.web.comparar && (
                <div className={s.comparar}>
                  {(['antes', 'despues'] as const).map(k => (
                    <figure key={k} className={s.compararLado} data-revela>
                      <span className={`${s.compararEtq} ${k === 'antes' ? s.compararAntes : ''}`}>{t[k]}</span>
                      <Portatil src={img(sol.web!.comparar![k].img)} alt={alt(sol.web!.comparar![k].img)} />
                      <figcaption className={s.pasoNota}>
                        <p className={s.pasoTexto}>{sol.web!.comparar![k].texto}</p>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}
              <Carrusel className={s.pasosWeb}>
                {sol.web.pasos.map((ps, i) => (
                  <li key={ps.img} className={s.paso} data-revela>
                    <Portatil src={img(ps.img)} alt={alt(ps.img)} />
                    <div className={s.pasoNota}>
                      <span className={s.pasoNum}>{String(i + 1).padStart(2, '0')}</span>
                      <p className={s.pasoTit}>{ps.titulo}</p>
                      <p className={s.pasoTexto}>{ps.texto}</p>
                    </div>
                  </li>
                ))}
              </Carrusel>
            </>
          )}

          <h3 className={s.subtitulo} data-revela>
            {sol.pasosTitulo}
          </h3>
          <Pasos pasos={sol.pasos} img={img} alt={alt} />

          {/* Un tercer perfil con su propia app (MASSolisapp: el portal del cliente) */}
          {sol.cliente && (
            <>
              <h3 className={s.subtitulo} data-revela>
                {sol.cliente.titulo}
              </h3>
              <div className={s.nota} data-revela style={{ maxWidth: '44em', marginBottom: 44 }}>
                <p>{sol.cliente.nota}</p>
              </div>
              <Pasos pasos={sol.cliente.pasos} img={img} alt={alt} />
            </>
          )}

          {sol.ar && (
            <>
              <h3 className={s.subtitulo} data-revela>
                {sol.ar.titulo}
              </h3>
              <div className={s.nota} data-revela style={{ maxWidth: '44em', marginBottom: 44 }}>
                <p>{sol.ar.nota}</p>
              </div>
              <Pasos pasos={sol.ar.pasos} img={img} alt={alt} />
              <div className={s.exploracion} data-revela>
                <p className={s.fichaTit}>{sol.ar.exploracionTitulo}</p>
                <ul className={s.estadosAr}>
                  {sol.ar.estados.map(st => (
                    <li key={st.texto} className={s[`ar_${st.tono}`]}>
                      {st.texto}
                    </li>
                  ))}
                </ul>
                <ul className={s.exploracionLista}>
                  {sol.ar.exploracion.map(x => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <h3 className={s.subtitulo} data-revela>
            {sol.probarTitulo}
          </h3>
          <div className={`${s.probarZona} ${sol.probarEn === 'portatil' ? s.probarAncho : ''}`}>
            <div data-revela>
              {sol.probarEn === 'portatil' ? (
                <>
                  <PortatilVivo url={urlPublica(e.prototipo)} titulo={`${card.nombre} · ${sol.probarTitulo}`} />
                  <div className={s.soloMovil}>
                    <MovilVivo url={urlPublica(e.prototipo)} titulo={`${card.nombre} · ${sol.probarTitulo}`} />
                  </div>
                </>
              ) : (
                <MovilVivo url={urlPublica(e.prototipo)} titulo={`${card.nombre} · ${sol.probarTitulo}`} />
              )}
            </div>
            <div className={s.lado}>
              <Nota giro={-2} className={s.notaLado}>
                <p className={s.postitTit}>{sol.probarNota}</p>
              </Nota>
              <a className={s.completa} href={urlPublica(e.prototipo)} target="_blank" rel="noopener noreferrer">
                {t.completa}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
            </div>
          </div>

          <section className={s.ia} data-revela aria-labelledby="ia">
            <svg className={s.iaIcono} viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="8" width="16" height="11" rx="3" />
              <path d="M12 4v4M9 13h.01M15 13h.01M9.5 16h5M2 12v3M22 12v3" />
            </svg>
            <h3 id="ia" className={s.fichaTit}>
              {t.ia}
            </h3>
            <p className={s.iaIntro}>{e.ia.intro}</p>
            <ul className={s.dymo} aria-label={t.metodos}>
              {e.ia.etiquetas.map(k => (
                <li key={k}>
                  <span>{k}</span>
                </li>
              ))}
            </ul>
            <ol className={s.iaPasos}>
              {e.ia.pasos.map((ps, i) => (
                <li key={ps.titulo}>
                  <span className={s.pasoNum}>{String(i + 1).padStart(2, '0')}</span>
                  <p className={s.pasoTit}>{ps.titulo}</p>
                  <p className={s.pasoTexto}>{ps.texto}</p>
                </li>
              ))}
            </ol>
          </section>

          <h3 className={s.subtitulo} data-revela>
            {e.cambios.titulo}
          </h3>
          {e.cambios.items.length > 7 ? (
            // Muchas decisiones: un fichero con las pestañas escalonadas en dos alturas
            <div className={s.conNota}>
              <div className={`${s.cajon} ${s.ficheroDecisiones}`} data-revela>
                <Fichas variante="cajon" filas={2} fichas={decisiones}>
                  <span className={a.portaEtiqueta}>
                    <span>{t.carpetaCambios}</span>
                  </span>
                  <span className={a.tirador} />
                </Fichas>
              </div>
              <Nota giro={2.5} className={s.notaLado}>
                <p className={s.postitTit}>{e.cambios.nota}</p>
              </Nota>
            </div>
          ) : (
            <div className={s.conNota}>
              <div className={`${s.carpeta} ${s.carpetaCambios}`} data-revela>
                <Fichas variante="carpeta" fichas={cambios} alto="13.5em">
                  <span className={a.etiqueta}>
                    <span className={a.etiquetaTit}>{t.carpetaCambios}</span>
                  </span>
                  <span className={a.boton} />
                  <span className={a.cordon} />
                </Fichas>
              </div>
              <Nota giro={2.5} className={s.notaLado}>
                <p className={s.postitTit}>{e.cambios.nota}</p>
              </Nota>
            </div>
          )}

          {e.seo && (
            <>
              <h3 className={s.subtitulo} data-revela>
                {e.seo.titulo}
              </h3>
              <div className={s.seo}>
                <div className={s.seoCodigo} data-revela>
                  <p className={s.fichaTit}>index.html</p>
                  <ul>
                    {e.seo.codigo.map(l => (
                      <li key={l}>
                        <code>{l}</code>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={s.seoLado}>
                  <Nota giro={-2}>
                    <p className={s.postitTit}>{e.seo.nota}</p>
                  </Nota>
                  <ul className={`${s.probado} ${s.seoLista}`} data-revela>
                    {e.seo.puntos.map(x => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          {e.logo && (
            <>
              <h3 className={s.subtitulo} data-revela>
                {e.logo.titulo}
              </h3>
              <div className={s.logoZona}>
                <div className={s.logoIzq}>
                  <div className={s.nota} data-revela>
                    <p>{e.logo.nota}</p>
                  </div>
                  {e.logo.antes && (
                    <figure className={s.logoAntes} data-revela>
                      <span className={`${s.compararEtq} ${s.compararAntes}`}>{t.antes}</span>
                      <img src={img(e.logo.antes.img)} alt={alt(e.logo.antes.img)} loading="lazy" />
                      <figcaption className={s.logoPie}>{e.logo.antes.pie}</figcaption>
                    </figure>
                  )}
                </div>
                <ul className={s.logos}>
                  {e.logo.versiones.map((v, i) => (
                    <li
                      key={v.img}
                      className={s.logoCarta}
                      style={{ rotate: `${[-1.5, 1, -0.8][i % 3]}deg` }}
                      data-revela
                    >
                      <span className={`${p.tape} ${s.cinta}`} />
                      <img src={img(v.img)} alt={alt(v.img)} loading="lazy" />
                      <span className={s.logoPie}>{v.pie}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {e.estilo && (
            <>
              <h3 className={s.subtitulo} data-revela>
                {e.estilo.titulo}
              </h3>
              <div className={s.estilo}>
                <div className={s.nota} data-revela>
                  <p>{e.estilo.nota}</p>
                  <ul className={s.muestras} aria-label={t.colores}>
                    {e.estilo.colores.map(c => (
                      <li key={c.hex} className={s.muestra}>
                        <span className={s.muestraColor} style={{ background: c.hex }} />
                        <span className={s.muestraNombre}>{c.nombre}</span>
                        <span className={s.muestraHex}>{c.hex}</span>
                      </li>
                    ))}
                  </ul>
                  <p className={s.tipo}>
                    <span className={s.tipoMuestra}>Aa</span>
                    <span>
                      <strong>{e.estilo.tipografia}</strong>
                      <br />
                      {e.estilo.tipografiaNota}
                    </span>
                  </p>
                </div>
                <div className={s.nota} data-revela>
                  <p className={s.fichaTit}>{t.contrastes}</p>
                  <Contrastes pares={e.estilo.contrastes} />
                </div>
              </div>
            </>
          )}
        </section>

        {/* ——— 04 Resultados ——— */}
        <section className={s.parte} aria-labelledby="resultados">
          <Titulo id="resultados" n={4}>
            {t.resultados}
          </Titulo>
          <div className={s.resultados}>
            <div className={s.probado} data-revela>
              <p className={s.fichaTit}>{e.resuelve ? t.resuelve : t.probado}</p>
              <ul>
                {(e.resuelve ?? e.probado).map(x => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <Nota giro={2} className={s.resultadoGrande}>
              <p className={s.etqNota}>{t.resultadoEtq}</p>
              <p className={s.postitTit}>{e.resultado}</p>
            </Nota>
          </div>
        </section>

        <nav className={s.final} aria-label={t.navCasos}>
          <Link to={ant.href} className={`${s.siguienteCaso} ${s.anteriorCaso}`}>
            <span className={s.etq}>{t.casoAnterior}</span>
            <span className={s.siguienteNombre}>
              {ant.card.numero} · {ant.card.nombre}
            </span>
            <span className={s.siguienteDesc}>{ant.card.descripcion}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 12H6M11 6.5 5.5 12 11 17.5" />
            </svg>
          </Link>
          <Link to={paths.casos} className={s.volver}>
            {t.todos}
          </Link>
          <Link to={sig.href} className={s.siguienteCaso}>
            <span className={s.etq}>{t.siguienteCaso}</span>
            <span className={s.siguienteNombre}>
              {sig.card.numero} · {sig.card.nombre}
            </span>
            <span className={s.siguienteDesc}>{sig.card.descripcion}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
            </svg>
          </Link>
        </nav>

        <Threads defs={HILOS} pins={PINES} unit={1} />
      </div>
    </PageShell>
  )
}
