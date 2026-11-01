import { useRef, type CSSProperties } from 'react'
import capas from '../assets/decor/capas.json'
import nota from '../assets/decor/nota.webp'
import romero from '../assets/archivo/romero.webp'
import taza from '../assets/decor/taza.webp'
import { cards, home, pistas, ui } from '../content'
import { Annotation, Leader } from '../components/Annotation'
import { CatPaw } from '../components/CatPaw'
import { Decor, PointerDepth } from '../components/Decor'
import { SheetArchitecture, SheetDesktop, SheetFlow } from '../components/DesignSheets'
import { Header } from '../components/Header'
import { Polaroid, type PolaroidHandle } from '../components/Polaroid'
import { SelloContacto } from '../components/SelloContacto'
import { Threads, cubicPath, sagPath, type ThreadDef, type ThreadsHandle } from '../components/Threads'
import { pinnedRect } from '../lib/cards'
import { box } from '../lib/layout'
import { exploreCards } from '../lib/explore'
import s from './Home.module.css'

/* Polaroids alrededor del hero, todas del mismo tamaño; la chincheta de cada una hace de eje del balanceo */
const TARJETA = { w: 272, h: 316 }
const card01 = pinnedRect({ cx: 1210, cy: 262, ...TARJETA, rot: -4, px: 7, py: 4.5 })
const card02 = pinnedRect({ cx: 270, cy: 655, ...TARJETA, rot: -3.5, px: 90, py: 4 })
const card03 = pinnedRect({ cx: 1270, cy: 738, ...TARJETA, rot: 8, px: 42, py: 3 })
const card04 = pinnedRect({ cx: 730, cy: 846, ...TARJETA, rot: 3, px: 50, py: 4 })

/* La nota rasgada se reduce para dejar aire al titular */
const NOTA_ESCALA = 0.75
const notaRect = {
  x: 150,
  y: 120,
  w: capas.nota.w * NOTA_ESCALA,
  h: capas.nota.h * NOTA_ESCALA,
}

/*
 * Un solo hilo que recorre las fotos sin cruzar ningún texto:
 * nota → Sobre mí → MASSolisapp (por debajo del botón) → Oh My Cat! → Cecotec.
 * Los casos se leen 01, 02, 03 de arriba abajo por la derecha.
 */
const threads: ThreadDef[] = [
  { id: 'A', from: 'pn', to: 'p2', draw: [0.5, 0.5], path: (a, b, u, t) => sagPath(a, b, 6 * u * t) },
  {
    id: 'B',
    from: 'p2',
    to: 'p4',
    draw: [1.0, 0.9],
    path: (a, b, u, t) =>
      cubicPath(a, { x: a.x + 20 * u, y: a.y + 300 * u * t }, { x: b.x - 140 * u, y: b.y - 20 * u * t }, b),
  },
  { id: 'C', from: 'p4', to: 'p3', draw: [1.9, 0.8], path: (a, b, u, t) => sagPath(a, b, 34 * u * t) },
  { id: 'D', from: 'p3', to: 'px', draw: [2.7, 0.4], path: (a, b, u, t) => sagPath(a, b, 4 * u * t) },
]

/* Cuándo aparece cada anotación (s): cuando el hilo llega a su foto */
const T_02 = 1.6
const T_03 = 2.6
const T_01 = 3.1

export function Home({ unit }: { unit: number }) {
  const threadsRef = useRef<ThreadsHandle>(null)
  const tense = (ids: string[]) => () => threadsRef.current?.tense(ids)
  // En el orden del recorrido del hilo
  const ohmycatRef = useRef<PolaroidHandle>(null)
  const sobreMiRef = useRef<PolaroidHandle>(null)
  const n4Ref = useRef<PolaroidHandle>(null)
  const cecotecRef = useRef<PolaroidHandle>(null)

  return (
    <PointerDepth unit={unit}>
      <div className={`papel ${s.stage}`} style={{ '--u': `${unit}px` } as CSSProperties}>
        {/* ——— Mesa de trabajo: solo bocetos de UX, romero, chai y la pata de gato ——— */}
        <div className={s.left}>
          <SheetArchitecture z={14} />
          <SheetFlow z={14} />
          <Decor src={nota} rect={notaRect} depth={3} z={16} decorative={false}>
            <figure className={s.cita} style={{ ...box(30, 30, 232, 162), transform: 'rotate(-3deg)' }}>
              <blockquote>
                <p>{home.cita.texto}</p>
              </blockquote>
              <figcaption>
                — {home.cita.autor}, <cite>{home.cita.año}</cite>
              </figcaption>
            </figure>
            <span className={s.anchor} data-anchor="pn" style={box(244, 204)} />
          </Decor>
          <Decor
            src={romero}
            rect={{ x: 39, y: 326, w: 122, h: 258 }}
            className={s.romero}
            depth={6}
            travelX="neg"
            z={20}
            wind={{ origin: '50% 100%', amp: 2.2, period: 5.6, delay: -1.3 }}
            hint={pistas.romero}
          />
          <CatPaw className={s.paw} style={box(-24, 812, 238)} withHint />
        </div>

        <div className={s.right}>
          <SheetDesktop z={14} />
          <Decor
            src={taza}
            rect={{ x: 1322, y: -30, w: 236, h: 236 }}
            depth={9}
            travelX="pos"
            travelY="neg"
            z={22}
            className={s.taza}
            tambalea
            hint={pistas.chai}
          />
          <p className={s.pagina} style={box(1196, 50)} aria-label={ui.pagina(home.pagina)}>
            {home.pagina}
          </p>
        </div>

        {/* ——— Navegación secundaria ——— */}
        <div className={s.left}>
          <Header variant="stage" />
        </div>

        <main>
          {/* ——— Hero ——— */}
          <div className={s.center}>
            <section className={s.hero} style={box(470, 248, 566)} aria-labelledby="titulo">
              <p className={s.etiqueta}>{home.etiqueta}</p>
              <h1 id="titulo" className={s.titulo}>
                <span>{home.titulo.linea1}</span> <em>{home.titulo.linea2}</em>
              </h1>
              <p className={s.texto}>{home.texto}</p>
              <div className={s.accion}>
                <button
                  type="button"
                  className={s.boton}
                  onClick={() => exploreCards([sobreMiRef, cecotecRef, ohmycatRef, n4Ref])}
                >
                  {home.boton}
                </button>
                <Annotation lines={home.chivato} delay={T_01} className={s.chivato} />
              </div>
            </section>
          </div>

          {/* ——— Polaroids: navegación principal ——— */}
          <section aria-labelledby="proyectos">
            <h2 id="proyectos" className="sr-only">
              {ui.proyectos}
            </h2>

            <div className={s.left}>
              <Polaroid
                ref={sobreMiRef}
                item={cards['sobre-mi']}
                rotate={card02.rot}
                pivot={card02.pivot}
                anchors={[{ id: 'p2', x: card02.pivot.x, y: card02.pivot.y }]}
                style={box(card02.x, card02.y, card02.w, card02.h)}
                onSway={tense(['A', 'B'])}
              />
              {/* Asoma por detrás de la polaroid; no se mueve con ella */}
              <SelloContacto style={box(372, 742, 138, 138)} />
              {/* Explica para qué sirve el sello; solo en la portada */}
              <Annotation lines={home.pistaSello} delay={T_03} className={s.cardNote} style={box(516, 722)} />
              <Leader from={[534, 790]} to={[511, 806]} delay={T_03} className={s.leader} />
            </div>

            <div className={s.right}>
              <Polaroid
                ref={cecotecRef}
                item={cards.cecotec}
                rotate={card01.rot}
                pivot={card01.pivot}
                anchors={[
                  { id: 'p1', x: card01.pivot.x, y: card01.pivot.y },
                  { id: 'px', x: 56, y: 97.5 },
                ]}
                style={box(card01.x, card01.y, card01.w, card01.h)}
                onSway={tense(['D'])}
              />
              <Annotation lines={cards.cecotec.nota!} delay={T_01} className={s.cardNote} style={box(1272, 464)} />
              <Leader from={[1314, 460]} to={[1296, 424]} delay={T_01} className={s.leader} />
            </div>

            <div className={s.right}>
              <Polaroid
                ref={ohmycatRef}
                item={cards.ohmycat}
                rotate={card03.rot}
                pivot={card03.pivot}
                anchors={[{ id: 'p3', x: card03.pivot.x, y: card03.pivot.y }]}
                style={box(card03.x, card03.y, card03.w, card03.h)}
                onSway={tense(['C', 'D'])}
              />
              <Annotation lines={cards.ohmycat.nota!} delay={T_03} className={s.cardNote} style={box(1000, 792)} />
              <Leader from={[1096, 808]} to={[1122, 796]} delay={T_03} className={s.leader} />
            </div>

            <div className={s.center}>
              <Polaroid
                ref={n4Ref}
                item={cards.massolis}
                rotate={card04.rot}
                pivot={card04.pivot}
                anchors={[{ id: 'p4', x: card04.pivot.x, y: card04.pivot.y }]}
                style={box(card04.x, card04.y, card04.w, card04.h)}
                onSway={tense(['B', 'C'])}
              />
              <Annotation lines={cards.massolis.nota!} delay={T_02} className={s.cardNote} style={box(898, 738)} />
              <Leader from={[894, 756]} to={[874, 766]} delay={T_02} className={s.leader} />
            </div>
          </section>
        </main>

        <Threads ref={threadsRef} defs={threads} pins={['pn', 'p1', 'p2', 'p3', 'p4', 'px']} unit={unit} />
      </div>
    </PointerDepth>
  )
}
