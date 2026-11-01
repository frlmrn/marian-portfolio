import whitby from '../assets/archivo/whitby.webp'
import frankenstein from '../assets/archivo/frankenstein.webp'
import retrato from '../assets/img/retrato-bn.webp'
import { pages, pistas, sobreMi, ui } from '../content'
import { Decor } from '../components/Decor'
import { StageShell } from '../components/StageShell'
import { SelloContacto } from '../components/SelloContacto'
import { CarpetaHerramientas, Diplomas, FicheroExperiencia, Huellas, PostIt } from '../components/Archivo'
import { cubicPath, sagPath, type ThreadDef } from '../components/Threads'
import { box } from '../lib/layout'
import { Link, paths } from '../lib/router'
import h from './Home.module.css'
import s from './AboutStage.module.css'

/*
 * El hilo rojo une las piezas: tu foto → el cajón de experiencia → los
 * diplomas → la carpeta de herramientas. Va por los márgenes y por debajo
 * del cajón para no cruzar ningún texto.
 */
const threads: ThreadDef[] = [
  {
    id: 'A',
    from: 'sm1',
    to: 'sm2',
    draw: [0.4, 0.7],
    // por el margen izquierdo, sin pasar sobre las fichas del cajón
    path: (a, b, u, t) =>
      cubicPath(a, { x: a.x - 40 * u, y: a.y + 170 * u * t }, { x: b.x - 110 * u, y: b.y - 90 * u * t }, b),
  },
  {
    id: 'B',
    from: 'sm2',
    to: 'sm3',
    draw: [1.0, 0.9],
    path: (a, b, u, t) =>
      cubicPath(a, { x: a.x + 44 * u, y: a.y + 190 * u * t }, { x: b.x - 60 * u, y: b.y + 290 * u * t }, b),
  },
  { id: 'C', from: 'sm3', to: 'sm4', draw: [1.8, 0.5], path: (a, b, u, t) => sagPath(a, b, 10 * u * t) },
]

/* Huellas de gato que salen de la pata y se van por la mesa */
const huellas = [
  { x: 214, y: 968, r: 76 },
  { x: 262, y: 936, r: 80 },
  { x: 312, y: 972, r: 74 },
  { x: 362, y: 942, r: 82 },
  { x: 414, y: 978, r: 78 },
]

/**
 * Sobre mí en escritorio, simplificado: la mesa sin bocetos, tu foto y la
 * presentación, el cajón de experiencia, la carpeta de herramientas y los
 * diplomas, unidos por el hilo rojo. De lo personal quedan dos piezas en
 * los bordes (Whitby y Frankenstein), cada una con su frase.
 */
export function AboutStage({ unit }: { unit: number }) {
  const page = pages['sobre-mi']
  return (
    <StageShell
      unit={unit}
      numero={page.numero}
      bocetos={false}
      threads={threads}
      pins={['sm1', 'sm2', 'sm3', 'sm4']}
      left={
        <>
          <Decor
            src={whitby}
            rect={{ x: -96, y: 452, w: 232, h: 174 }}
            depth={3}
            travelX="neg"
            z={13}
            print={{ rotate: 16, position: '62% 60%' }}
            hint={pistas.whitby}
          />
          <Decor
            src={frankenstein}
            rect={{ x: 540, y: 944, w: 230, h: 160 }}
            depth={3}
            travelY="pos"
            z={13}
            print={{ rotate: -7, position: '35% 72%' }}
            hint={pistas.frankenstein}
          />
        </>
      }
    >
      <Huellas pasos={huellas} />

      {/* Tu foto: recorte de periódico pegado con cinta sobre la esquina de la hoja */}
      <figure className={s.retrato} style={box(186, 92, 176, 219)}>
        <img src={retrato} alt="Marian López Solís" />
        <span className={h.cinta} style={{ ...box(52, -14, 76, 26), transform: 'rotate(4deg)' }} />
      </figure>

      <section className={s.intro} style={box(330, 108, 480)} aria-labelledby="titulo">
        <h1 id="titulo" className={s.title}>
          {sobreMi.nombre}
        </h1>
        <p className={s.rol}>{sobreMi.rol}</p>
        <p className={`${s.lead} ${s.gancho}`}>
          {sobreMi.gancho[0]} <strong>{sobreMi.gancho[1]}</strong>
        </p>
        <p className={s.lead}>{sobreMi.lead}</p>
        {/* Bajo la presentación, como en la portada: sin tapar ningún objeto */}
        <Link to={paths.casos} className={s.cta}>
          {sobreMi.boton}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
          </svg>
        </Link>
      </section>

      {/* ——— Cajón de experiencia ——— */}
      <section className={`${s.objeto} ${s.cajon}`} style={box(318, 524, 470)} aria-labelledby="trayectoria">
        <h2 id="trayectoria" className="sr-only">
          {ui.dondeHeTrabajado}
        </h2>
        <FicheroExperiencia />
      </section>

      {/* ——— Carpeta de herramientas ——— */}
      <section className={`${s.objeto} ${s.carpeta}`} style={box(872, 84, 440)} aria-labelledby="herramientas">
        <h2 id="herramientas" className="sr-only">
          {ui.herramientasYSoftware}
        </h2>
        <CarpetaHerramientas />
      </section>

      {/* ——— Formación ——— */}
      <section className={`${s.objeto} ${s.formacion}`} style={box(918, 588, 360)} aria-labelledby="formacion">
        <PostIt id="formacion" className={s.postitDiplomas}>
          {ui.estudiado}
        </PostIt>
        <Diplomas />
        {/* Punto del hilo en la esquina de la nota, sin cruzar su texto; va dentro para moverse con ella */}
        <span className={s.anchor} data-anchor="sm3" style={{ left: '-0.9em', top: '5em' }} />
      </section>

      {/* Puntos del hilo: foto, cajón, diplomas y carpeta */}
      <span className={s.anchor} data-anchor="sm1" style={box(204, 294)} />
      <span className={s.anchor} data-anchor="sm2" style={box(338, 738)} />
      <span className={s.anchor} data-anchor="sm4" style={box(986, 396)} />
      {/* Atajo a Contacto: el sello, pequeño, junto a la carpeta */}
      <SelloContacto style={{ ...box(1392, 300, 100, 100) }} />
    </StageShell>
  )
}
