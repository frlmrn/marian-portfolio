import type { CSSProperties, ReactNode } from 'react'
import romero from '../assets/archivo/romero.webp'
import taza from '../assets/decor/taza.webp'
import { pistas, ui } from '../content'
import { box } from '../lib/layout'
import { CatPaw } from './CatPaw'
import { Decor, PointerDepth } from './Decor'
import {
  SheetAfinidad,
  SheetAgenda,
  SheetArchitecture,
  SheetBrief,
  SheetDesktop,
  SheetDiamante,
  SheetFlow,
  SheetJourney,
  SheetPersona,
} from './DesignSheets'

/*
 * Las hojas de la mesa cambian con la página: bocetos de UX en la portada,
 * hojas de investigación en Casos y la preparación de la primera
 * conversación en Contacto. Sobre mí no lleva hojas (sus objetos son personales).
 */
const juegos = {
  ux: [SheetArchitecture, SheetFlow, SheetDesktop],
  investigacion: [SheetPersona, SheetJourney, SheetAfinidad],
  contacto: [SheetBrief, SheetAgenda, SheetDiamante],
} as const
export type Bocetos = keyof typeof juegos
import { Header } from './Header'
import { Threads, type ThreadDef } from './Threads'
import h from '../views/Home.module.css'

/**
 * Mesa a pantalla completa de las secciones interiores (escritorio): la misma
 * que la portada —bocetos de UX, romero, chai y pata de gato— con la cabecera
 * y el número de página. El contenido va en el bloque central, en unidades de
 * la imagen (1536 × 1024).
 */
export function StageShell({
  unit,
  numero,
  children,
  threads,
  pins = [],
  left,
  right,
  bocetos = 'ux',
}: {
  unit: number
  numero: string
  children: ReactNode
  threads?: ThreadDef[]
  pins?: string[]
  /** Objetos propios de la sección, anclados al borde izquierdo o derecho. */
  left?: ReactNode
  right?: ReactNode
  /** Qué hojas hay en la mesa (según la página); false para una mesa sin hojas. */
  bocetos?: Bocetos | false
}) {
  const [Arriba, Abajo, Derecha] = bocetos ? juegos[bocetos] : []
  return (
    <PointerDepth unit={unit}>
      <div className={`papel ${h.stage}`} style={{ '--u': `${unit}px` } as CSSProperties}>
        <div className={h.left}>
          {Arriba && <Arriba z={14} />}
          {Abajo && <Abajo z={14} />}
          <Decor
            src={romero}
            rect={{ x: 39, y: 400, w: 122, h: 258 }}
            className={h.romero}
            depth={6}
            travelX="neg"
            z={20}
            wind={{ origin: '50% 100%', amp: 2.2, period: 5.6, delay: -1.3 }}
            hint={pistas.romero}
          />
          <CatPaw className={h.paw} style={box(-24, 812, 238)} withHint />
          {left}
          <Header variant="stage" />
        </div>
        <div className={h.right}>
          {Derecha && <Derecha z={14} />}
          <Decor
            src={taza}
            rect={{ x: 1322, y: -30, w: 236, h: 236 }}
            depth={9}
            travelX="pos"
            travelY="neg"
            z={22}
            className={h.taza}
            tambalea
            hint={pistas.chai}
          />
          {right}
          <p className={h.pagina} style={box(1196, 50)} aria-label={ui.pagina(numero)}>
            {numero}
          </p>
        </div>

        <main className={h.center}>{children}</main>

        {threads && <Threads defs={threads} pins={pins} unit={unit} />}
      </div>
    </PointerDepth>
  )
}
