import { useEffect, useRef, useState, type CSSProperties } from 'react'
import nota from '../assets/decor/nota.webp'
import romero from '../assets/archivo/romero.webp'
import chai from '../assets/decor/chai.webp'
import { cards, home, ui, type CardItem } from '../content'
import { Annotation } from '../components/Annotation'
import { BotonArriba } from '../components/BotonArriba'
import { CatPaw } from '../components/CatPaw'
import { Header } from '../components/Header'
import { Polaroid, type PolaroidHandle } from '../components/Polaroid'
import { SelloContacto } from '../components/SelloContacto'
import { Threads, sagPath, type ThreadDef, type ThreadsHandle } from '../components/Threads'
import { exploreCards } from '../lib/explore'
import s from './HomeMobile.module.css'

/* En vertical las fotos bajan en zigzag; el hilo une la base de cada una con la chincheta de la siguiente */
const threads: ThreadDef[] = [
  {
    id: 'A',
    from: 'm1b',
    to: 'm2',
    draw: [0.2, 0.7],
    path: (a, b, u, t) => sagPath(a, b, 40 * u * t),
  },
  {
    id: 'B',
    from: 'm2b',
    to: 'm3',
    draw: [0.9, 0.7],
    path: (a, b, u, t) => sagPath(a, b, 40 * u * t),
  },
  {
    id: 'C',
    from: 'm3b',
    to: 'm4',
    draw: [1.6, 0.7],
    path: (a, b, u, t) => sagPath(a, b, 40 * u * t),
  },
]

// Solo el id: el texto de cada tarjeta se lee al pintar, en el idioma elegido
const rows: {
  id: CardItem['id']
  rot: number
  side: 'left' | 'right'
  n: number
  tense: string[]
}[] = [
  { id: 'sobre-mi', rot: -3, side: 'left', n: 1, tense: ['A'] },
  { id: 'massolis', rot: 3.5, side: 'right', n: 2, tense: ['A', 'B'] },
  { id: 'cecotec', rot: -2.5, side: 'left', n: 3, tense: ['B', 'C'] },
  { id: 'ohmycat', rot: 2.5, side: 'right', n: 4, tense: ['C'] },
]

/** Activa las animaciones de una zona cuando entra en pantalla. */
function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [seen])
  return [ref, seen] as const
}

export function HomeMobile() {
  const unit = Math.min(innerWidth / 600, 1)
  const threadsRef = useRef<ThreadsHandle>(null)
  const [cardsRef, cardsSeen] = useInView<HTMLDivElement>()
  const cardRefs = [
    useRef<PolaroidHandle>(null),
    useRef<PolaroidHandle>(null),
    useRef<PolaroidHandle>(null),
    useRef<PolaroidHandle>(null),
  ]

  const explore = () => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    cardsRef.current?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'start',
    })
    // espera a que termine el desplazamiento antes de balancear las tarjetas
    window.setTimeout(() => exploreCards(cardRefs, 220), reduce ? 0 : 650)
  }

  return (
    <div className={`papel ${s.page}`} style={{ '--u': `${unit}px` } as CSSProperties}>
      <img className={s.cup} src={chai} alt="" aria-hidden="true" />
      <Header variant="flow" />

      <main className={s.main}>
        <section className={s.hero} aria-labelledby="titulo">
          <p className={s.etiqueta}>{home.etiqueta}</p>
          <h1 id="titulo" className={s.titulo}>
            <span>{home.titulo.linea1}</span> <em>{home.titulo.linea2}</em>
          </h1>
          <p className={s.texto}>{home.texto}</p>
          <button type="button" className={s.boton} onClick={explore}>
            {home.boton}
          </button>
          <Annotation lines={home.chivato} delay={0.5} className={s.chivato} />
        </section>

        <figure className={s.note}>
          <img src={nota} alt="" aria-hidden="true" />
          <div className={s.noteText}>
            <blockquote>
              <p>{home.cita.texto}</p>
            </blockquote>
            <figcaption>
              — {home.cita.autor}, <cite>{home.cita.año}</cite>
            </figcaption>
          </div>
        </figure>

        <section aria-labelledby="proyectos" className={s.projects}>
          <h2 id="proyectos" className="sr-only">
            {ui.proyectos}
          </h2>
          <div ref={cardsRef} className={s.cards} data-play={cardsSeen}>
            {rows.map(({ id, rot, side, n, tense }, i) => {
              const item = cards[id]
              return (
                <div key={item.id} className={`${s.row} ${s[side]}`}>
                  {item.nota && <Annotation lines={item.nota} delay={0.5 + i * 0.7} className={s.cardNote} />}
                  <Polaroid
                    ref={cardRefs[i]}
                    item={item}
                    rotate={rot}
                    pivot={{ x: 50, y: 3 }}
                    anchors={[
                      { id: `m${n}`, x: 50, y: 3 },
                      ...(n < rows.length ? [{ id: `m${n}b`, x: 50, y: 99 }] : []),
                    ]}
                    className={s.card}
                    onSway={() => threadsRef.current?.tense(tense)}
                  />
                  {item.id === 'sobre-mi' && (
                    <>
                      <SelloContacto className={s.sello} />
                      <Annotation lines={home.pistaSello} delay={0.5} className={s.selloNota} />
                      <svg className={s.selloFlecha} viewBox="0 0 30 44" aria-hidden="true">
                        <path d="M8 2C22 12 24 26 15 41M15 41l-2-10M15 41l9-6" />
                      </svg>
                    </>
                  )}
                </div>
              )
            })}
            <Threads
              ref={threadsRef}
              defs={threads}
              pins={['m1', 'm2', 'm3', 'm4', 'm1b', 'm2b', 'm3b']}
              unit={unit * 1.3}
            />
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <p>Marian · Digital Designer</p>
        <div className={s.bottom} aria-hidden="true">
          <CatPaw className={s.paw} />
          <img className={s.sprigRight} src={romero} alt="" />
        </div>
      </footer>
      <BotonArriba />
    </div>
  )
}
