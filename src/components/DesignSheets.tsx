import type { CSSProperties, ReactNode } from 'react'
import { pistas, ui } from '../content'
import { box } from '../lib/layout'
import { Hint, type HintText } from './Hint'
import s from './DesignSheets.module.css'

/*
 * Hojas de trabajo impresas con bocetos de diseño digital: sustituyen a los
 * planos y mapas antiguos del collage. Línea fina de tinta, pocas piezas y
 * reconocibles: arquitectura de la información, retícula y escala tipográfica,
 * flujo de usuario con wireframe móvil y wireframe de escritorio con marcas
 * de accesibilidad. Todo es decorativo (aria-hidden).
 */

type SheetProps = {
  x: number
  y: number
  w: number
  h: number
  rot: number
  z: number
  style?: CSSProperties
  hint?: HintText
}

function Sheet({ x, y, w, h, rot, z, style, hint, children }: SheetProps & { children: ReactNode }) {
  return (
    <div
      className={s.sheet}
      style={{ ...box(x, y, w, h), transform: `rotate(${rot}deg)`, zIndex: z, ...style }}
      aria-hidden="true"
    >
      <Hint hint={hint} giro={rot}>
        <div className={s.paper}>
          <svg className={s.ink} viewBox={`0 0 ${w} ${h}`}>
            {children}
          </svg>
        </div>
      </Hint>
    </div>
  )
}

/**
 * Hoja de la esquina superior izquierda: cruzada en diagonal y casi toda
 * fuera de la pantalla, solo asoma la punta (igual en todas las páginas).
 */
const ESQUINA = { x: -96, y: -150, w: 172, h: 334, rot: -24 }

const Label = ({
  x,
  y,
  children,
  size = 7.5,
  anchor,
}: {
  x: number
  y: number
  children: ReactNode
  size?: number
  anchor?: 'middle' | 'end'
}) => (
  <text x={x} y={y} fontSize={size} textAnchor={anchor} className={s.label}>
    {children}
  </text>
)

/** Marca de accesibilidad numerada (orden de foco), en burdeos. */
const Marker = ({ x, y, n }: { x: number; y: number; n: number }) => (
  <g className={s.marker}>
    <circle cx={x} cy={y} r={6} />
    <text x={x} y={y + 2.6} fontSize={7} textAnchor="middle">
      {n}
    </text>
  </g>
)

/**
 * Columna izquierda: ficha vertical de sistema de diseño que entra desde la
 * esquina (el papel queda cortado por el borde), ordenada de arriba abajo: arquitectura de la información, retícula, escala
 * tipográfica y espaciado.
 */
export function SheetArchitecture({ z }: { z: number }) {
  return (
    <Sheet {...ESQUINA} z={z} hint={pistas.arquitectura}>
      {/* La hoja entra desde la esquina: el papel se corta, el dibujo no */}
      <g transform="translate(24 28)">
        <Label x={15} y={22} size={6.5}>
          {ui.bocetos.arquitectura}
        </Label>
        {/* Árbol de navegación */}
        <rect x={51} y={31} width={48} height={15} rx={1.5} />
        <Label x={75} y={41} anchor="middle">
          {ui.bocetos.inicio}
        </Label>
        <path d="M75 46 V54 M33 54 H117 M33 54 V61 M75 54 V61 M117 54 V61" />
        <rect x={15} y={61} width={36} height={14} rx={1.5} />
        <rect x={57} y={61} width={36} height={14} rx={1.5} />
        <rect x={99} y={61} width={36} height={14} rx={1.5} />
        <Label x={33} y={70.5} size={6} anchor="middle">
          {ui.bocetos.casos}
        </Label>
        <Label x={75} y={70.5} size={6} anchor="middle">
          {ui.bocetos.perfil}
        </Label>
        <Label x={117} y={70.5} size={6} anchor="middle">
          {ui.bocetos.contacto}
        </Label>
        <path d="M33 75 V81 M24 81 H42 M24 81 V86 M42 81 V86" />
        <rect x={17} y={86} width={14} height={9} />
        <rect x={35} y={86} width={14} height={9} />
        <path className={s.dashed} d="M117 75 V91 H100" />
        <path className={s.thin} d="M15 108 H135" />
        {/* Retícula de 6 columnas */}
        <Label x={15} y={122} size={6.5}>
          {ui.bocetos.reticula}
        </Label>
        <g className={s.grid}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <rect key={i} x={15 + i * 21} y={129} width={15} height={56} />
          ))}
        </g>
        <path className={s.thin} d="M15 199 H135" />
        {/* Escala tipográfica */}
        <Label x={15} y={213} size={6.5}>
          {ui.bocetos.escala}
        </Label>
        <text x={14} y={248} className={s.specimen} fontSize={27}>
          Aa
        </text>
        <Label x={56} y={228} size={6}>
          48 / 32 / 24 / 16
        </Label>
        <path d="M56 235 H135 M56 242 H122 M56 249 H108" />
        {/* Espaciado */}
        <Label x={15} y={267} size={6.5}>
          {ui.bocetos.espaciado}
        </Label>
        {/* Los cuadrados, debajo del rótulo y sin tocarlo */}
        <g className={s.grid}>
          <rect x={15} y={288} width={4} height={4} />
          <rect x={25} y={284} width={8} height={8} />
          <rect x={39} y={280} width={12} height={12} />
          <rect x={57} y={276} width={16} height={16} />
        </g>
        <Label x={80} y={291} size={6}>
          4 · 8 · 12 · 16
        </Label>
      </g>
    </Sheet>
  )
}

/** Abajo a la izquierda: flujo de usuario y wireframe móvil con orden de foco. */
export function SheetFlow({ z }: { z: number }) {
  const step = (x: number, y: number, t: string) => (
    <g>
      <rect x={x} y={y} width={58} height={22} rx={2} />
      <Label x={x + 29} y={y + 14} anchor="middle">
        {t}
      </Label>
    </g>
  )
  return (
    <Sheet x={-18} y={834} w={486} h={210} rot={-2.4} z={z} hint={pistas.flujo}>
      <Label x={26} y={24} size={7}>
        {ui.bocetos.flujo}
      </Label>
      {step(26, 36, ui.bocetos.entrada)}
      {step(110, 36, ui.bocetos.elegirDia)}
      {/* Decisión */}
      <path d="M222 36 L240 47 L222 58 L204 47 Z" />
      <Label x={222} y={70} size={6.5} anchor="middle">
        {ui.bocetos.cuenta}
      </Label>
      {step(262, 36, ui.bocetos.datos)}
      {step(262, 82, ui.bocetos.acceso)}
      {step(346, 36, ui.bocetos.confirmar)}
      <g className={s.arrows}>
        <path d="M84 47 H108 M168 47 H202 M240 47 H260 M320 47 H344" />
        <path d="M222 58 V93 H260" />
        <path d="M291 82 V60" />
        <path d="M104 44 l4 3 -4 3 M198 44 l4 3 -4 3 M256 44 l4 3 -4 3 M340 44 l4 3 -4 3 M256 90 l4 3 -4 3 M288 64 l3 -4 3 4" />
      </g>
      <Label x={250} y={44} size={6}>
        no
      </Label>
      <Label x={226} y={86} size={6}>
        {ui.bocetos.si}
      </Label>
      {/* Anotación de usabilidad */}
      <path className={s.dashed} d="M150 62 C150 96 120 104 92 104" />
      <Label x={26} y={108} size={6.8}>
        {ui.bocetos.pasoLargo}
      </Label>
      {/* Wireframe móvil */}
      <rect x={420} y={22} width={50} height={96} rx={7} />
      <path d="M426 34 H464 M426 40 H448" />
      <rect x={426} y={46} width={38} height={26} />
      <path className={s.thin} d="M426 46 L464 72 M464 46 L426 72" />
      <path d="M426 80 H462 M426 86 H456 M426 92 H460" />
      <rect x={426} y={100} width={38} height={10} rx={1.5} />
      <Marker x={414} y={37} n={1} />
      <Marker x={414} y={58} n={2} />
      <Marker x={414} y={105} n={3} />
      <Label x={404} y={130} size={6.5} anchor="end">
        {ui.bocetos.foco}
      </Label>
    </Sheet>
  )
}

/** Abajo a la derecha: wireframe de escritorio, componentes y accesibilidad. */
export function SheetDesktop({ z }: { z: number }) {
  return (
    <Sheet x={884} y={926} w={676} h={210} rot={-7.5} z={z} hint={pistas.wireframe}>
      <Label x={30} y={22} size={7}>
        {ui.bocetos.wireframe}
      </Label>
      {/* Ventana del navegador */}
      <rect x={30} y={30} width={250} height={150} rx={3} />
      <path d="M30 42 H280" />
      <circle cx={38} cy={36} r={1.6} />
      <circle cx={44} cy={36} r={1.6} />
      <circle cx={50} cy={36} r={1.6} />
      <path d="M40 52 H70 M190 52 H210 M218 52 H238 M246 52 H270" />
      <rect x={40} y={62} width={130} height={14} />
      <path d="M40 84 H150 M40 90 H130" />
      <rect x={40} y={98} width={46} height={12} rx={1.5} />
      <rect x={188} y={62} width={82} height={48} />
      <path className={s.thin} d="M188 62 L270 110 M270 62 L188 110" />
      {[0, 1, 2].map(i => (
        <g key={i}>
          <rect x={40 + i * 78} y={124} width={68} height={44} />
          <path d={`M${46 + i * 78} 156 H${96 + i * 78} M${46 + i * 78} 162 H${84 + i * 78}`} />
        </g>
      ))}
      {/* Columnas de la retícula sobre la ventana */}
      <g className={s.columns}>
        {[0, 1, 2, 3].map(i => (
          <rect key={i} x={40 + i * 59} y={46} width={50} height={130} />
        ))}
      </g>
      {/* Componentes */}
      <Label x={312} y={40} size={7}>
        {ui.bocetos.componentes}
      </Label>
      <rect x={312} y={48} width={64} height={18} rx={2} />
      <Label x={344} y={60} anchor="middle">
        {ui.bocetos.boton}
      </Label>
      <rect x={386} y={48} width={64} height={18} rx={2} className={s.thin} />
      <Label x={418} y={60} anchor="middle">
        {ui.bocetos.secundario}
      </Label>
      <rect x={312} y={76} width={138} height={18} rx={2} />
      <Label x={318} y={88} size={6.5}>
        {ui.bocetos.campo}
      </Label>
      <path className={s.dashed} d="M312 100 H376 M312 100 v-3 M376 100 v-3" />
      <Label x={344} y={110} size={6} anchor="middle">
        {ui.bocetos.minimo}
      </Label>
      {/* Accesibilidad: contraste y foco */}
      <Label x={472} y={40} size={7}>
        {ui.bocetos.accesibilidad}
      </Label>
      <circle cx={484} cy={60} r={10} />
      <path className={s.fill} d="M484 50 A10 10 0 0 1 484 70 Z" />
      <Label x={500} y={63}>
        {ui.bocetos.contraste}
      </Label>
      <rect x={474} y={80} width={46} height={16} rx={2} />
      <rect x={471} y={77} width={52} height={22} rx={3} className={s.focus} />
      <Label x={530} y={91}>
        {ui.bocetos.focoVisible}
      </Label>
      <Marker x={60} y={62} n={1} />
      <Marker x={60} y={104} n={2} />
      <Marker x={52} y={130} n={3} />
    </Sheet>
  )
}

/* ——— Casos: hojas de investigación ——— */

/** Arriba a la izquierda: ficha de persona (proto-persona) a medio rellenar. */
export function SheetPersona({ z }: { z: number }) {
  const b = ui.bocetos
  const lista = (y0: number, n: number, x: boolean) =>
    Array.from({ length: n }, (_, i) => {
      const y = y0 + i * 12
      return (
        <g key={i}>
          {x ? (
            <path className={s.focus} d={`M15 ${y - 3} l5 5 M20 ${y - 3} l-5 5`} />
          ) : (
            <circle cx={17.5} cy={y - 0.5} r={2} />
          )}
          <path d={`M26 ${y} H${126 - i * 14}`} />
        </g>
      )
    })
  return (
    <Sheet {...ESQUINA} z={z} hint={pistas.persona}>
      <g transform="translate(24 28)">
        <Label x={15} y={22} size={6.5}>
          {b.persona}
        </Label>
        <circle cx={33} cy={50} r={15} />
        <circle cx={33} cy={46} r={5} />
        <path d="M24 61 Q33 50 42 61" />
        <path d="M56 44 H122 M56 52 H106 M56 60 H92" />
        <path className={s.thin} d="M15 80 H135" />
        <Label x={15} y={94} size={6.5}>
          {b.objetivos}
        </Label>
        {lista(106, 3, false)}
        <path className={s.thin} d="M15 142 H135" />
        <Label x={15} y={156} size={6.5}>
          {b.frustraciones}
        </Label>
        {lista(168, 3, true)}
        <path className={s.thin} d="M15 204 H135" />
        <Label x={15} y={218} size={6.5}>
          {b.cita}
        </Label>
        <text x={13} y={250} className={s.specimen} fontSize={28}>
          “
        </text>
        <path d="M34 232 H132 M34 240 H126 M34 248 H112" />
        <path className={s.thin} d="M15 262 H135" />
        <Label x={15} y={276} size={6.5}>
          {b.canales}
        </Label>
        <g className={s.grid}>
          <rect x={15} y={282} width={84} height={5} />
          <rect x={15} y={290} width={58} height={5} />
          <rect x={15} y={298} width={36} height={5} />
        </g>
      </g>
    </Sheet>
  )
}

/** Abajo a la izquierda: mapa de experiencia con la curva de emociones. */
export function SheetJourney({ z }: { z: number }) {
  const b = ui.bocetos
  return (
    <Sheet x={-18} y={834} w={486} h={210} rot={-2.4} z={z} hint={pistas.journey}>
      <Label x={26} y={24} size={7}>
        {b.journey}
      </Label>
      {b.etapas.map((e, i) => (
        <g key={e}>
          <Label x={70 + i * 88} y={44} anchor="middle">
            {e}
          </Label>
          {i > 0 && <path className={s.thin} d={`M${26 + i * 88} 34 V176`} />}
        </g>
      ))}
      <path className={s.thin} d="M26 52 H466" />
      <Label x={20} y={78} size={8}>
        +
      </Label>
      <Label x={20} y={150} size={8}>
        –
      </Label>
      <path className={s.dashed} d="M30 112 H466" />
      <path className={s.focus} d="M44 92 C84 70 116 80 158 96 S228 150 250 142 S320 72 340 74 S418 60 452 66" />
      {[
        [70, 82],
        [158, 96],
        [250, 142],
        [334, 76],
        [422, 63],
      ].map(([x, y]) => (
        <circle key={x} className={s.dot} cx={x} cy={y} r={2.4} />
      ))}
      <g className={s.marker}>
        <circle cx={250} cy={142} r={7} />
      </g>
      <Label x={262} y={160} size={6.5}>
        {b.friccion}
      </Label>
      <path className={s.dashed} d="M244 148 C222 170 190 176 160 176" />
      <Label x={96} y={179} size={6.5}>
        {b.oportunidad}
      </Label>
    </Sheet>
  )
}

/** Abajo a la derecha: mapa de afinidad (post-its agrupados) y el insight. */
export function SheetAfinidad({ z }: { z: number }) {
  const b = ui.bocetos
  const postit = (x: number, y: number, r: number, k: string) => (
    <g key={k} transform={`rotate(${r} ${x + 13} ${y + 11})`}>
      <rect className={s.postit} x={x} y={y} width={26} height={22} />
      <path className={s.thin} d={`M${x + 4} ${y + 8} H${x + 22} M${x + 4} ${y + 13} H${x + 17}`} />
    </g>
  )
  return (
    <Sheet x={884} y={926} w={676} h={210} rot={-7.5} z={z} hint={pistas.afinidad}>
      <Label x={30} y={22} size={7}>
        {b.afinidad}
      </Label>
      {b.grupos.map((g, i) => {
        const x0 = 30 + i * 172
        return (
          <g key={g}>
            <rect className={s.dashed} x={x0} y={32} width={156} height={92} rx={8} />
            <Label x={x0 + 10} y={46} size={7}>
              {g}
            </Label>
            {postit(x0 + 10, 54, -4, 'a')}
            {postit(x0 + 42, 52, 3, 'b')}
            {postit(x0 + 74, 56, -2, 'c')}
            {postit(x0 + 20, 86, 2, 'd')}
            {postit(x0 + 54, 88, -3, 'e')}
            {i < 2 && <path className={s.arrows} d={`M${x0 + 158} 78 H${x0 + 170} M${x0 + 166} 75 l4 3 -4 3`} />}
          </g>
        )
      })}
      <rect className={s.focus} x={548} y={42} width={96} height={64} rx={3} />
      <Label x={560} y={58} size={7}>
        {b.insight}
      </Label>
      <path d="M560 70 H630 M560 78 H622 M560 86 H604" />
      <path className={s.arrows} d="M532 78 H546 M542 75 l4 3 -4 3" />
    </Sheet>
  )
}

/* ——— Contacto: preparar la primera conversación ——— */

/** Arriba a la izquierda: brief de la primera llamada, con preguntas para marcar. */
export function SheetBrief({ z }: { z: number }) {
  const b = ui.bocetos
  return (
    <Sheet {...ESQUINA} z={z} hint={pistas.brief}>
      <g transform="translate(24 28)">
        <Label x={15} y={22} size={6.5}>
          {b.brief}
        </Label>
        {b.preguntas.map((q, i) => {
          const y = 46 + i * 46
          return (
            <g key={q}>
              <rect x={15} y={y - 7} width={8} height={8} />
              {i < 2 && <path className={s.focus} d={`M15.5 ${y - 3} l3 3.5 l6 -9`} />}
              <Label x={28} y={y} size={6.5}>
                {q}
              </Label>
              <path className={s.thin} d={`M28 ${y + 11} H135 M28 ${y + 20} H${120 - i * 6}`} />
            </g>
          )
        })}
        <Label x={15} y={282} size={6.5}>
          {b.notas}
        </Label>
        <path className={s.thin} d="M15 292 H135 M15 300 H112" />
      </g>
    </Sheet>
  )
}

/** Abajo a la izquierda: agenda de la semana con la primera conversación marcada. */
export function SheetAgenda({ z }: { z: number }) {
  const b = ui.bocetos
  const horas = ['9:00', '11:00', '13:00', '16:00']
  return (
    <Sheet x={-18} y={834} w={486} h={210} rot={-2.4} z={z} hint={pistas.agenda}>
      <Label x={26} y={24} size={7}>
        {b.agenda}
      </Label>
      {b.dias.map((d, i) => (
        <g key={i}>
          <Label x={100 + i * 80} y={44} anchor="middle">
            {d}
          </Label>
          <path className={s.thin} d={`M${60 + i * 80} 34 V172`} />
        </g>
      ))}
      <path className={s.thin} d="M460 34 V172" />
      {horas.map((h, i) => (
        <g key={h}>
          <Label x={26} y={66 + i * 30} size={6}>
            {h}
          </Label>
          <path className={s.thin} d={`M60 ${52 + i * 30} H460`} />
        </g>
      ))}
      <path className={s.thin} d="M60 172 H460" />
      <g className={s.grid}>
        <rect x={64} y={56} width={72} height={22} />
        <rect x={144} y={116} width={72} height={22} />
        <rect x={304} y={56} width={72} height={52} />
        <rect x={384} y={146} width={72} height={22} />
      </g>
      <rect className={s.focus} x={222} y={84} width={76} height={26} rx={3} />
      <Label x={260} y={100} size={6} anchor="middle">
        {b.conversacion}
      </Label>
    </Sheet>
  )
}

/** Abajo a la derecha: el doble diamante, cómo trabajo un proyecto. */
export function SheetDiamante({ z }: { z: number }) {
  const b = ui.bocetos
  return (
    <Sheet x={884} y={926} w={676} h={210} rot={-7.5} z={z} hint={pistas.diamante}>
      <Label x={250} y={16} size={7}>
        {b.diamante}
      </Label>
      <path d="M250 56 L350 26 L450 56 L350 86 Z M450 56 L550 26 L650 56 L550 86 Z" />
      <path className={s.dashed} d="M350 26 V86 M550 26 V86" />
      {b.fases.map((f, i) => (
        <Label key={f} x={300 + i * 100} y={59} size={6.5} anchor="middle">
          {f}
        </Label>
      ))}
      <Label x={244} y={59} size={6.5} anchor="end">
        {b.problema}
      </Label>
      <Label x={656} y={59} size={6.5}>
        {b.solucion}
      </Label>
      <g className={s.marker}>
        <circle cx={450} cy={56} r={5} />
      </g>
      <Label x={450} y={100} size={6} anchor="middle">
        Brief
      </Label>
    </Sheet>
  )
}
