import { createContext, useContext, useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'motion/react'
import { box } from '../lib/layout'
import { Hint, type HintText } from './Hint'
import s from './Decor.module.css'

type Pointer = {
  mx: MotionValue<number>
  my: MotionValue<number>
  unit: number
}
const PointerContext = createContext<Pointer | null>(null)

/**
 * Sigue el ratón (de -1 a 1 en cada eje, suavizado con muelle) para el
 * efecto de profundidad de los objetos de los bordes.
 */
export function PointerDepth({ unit, children }: { unit: number; children: ReactNode }) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 45, damping: 18, mass: 1 })
  const my = useSpring(rawY, { stiffness: 45, damping: 18, mass: 1 })
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const fine = matchMedia('(pointer: fine)')
    if (!fine.matches) return
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / innerWidth) * 2 - 1)
      rawY.set((e.clientY / innerHeight) * 2 - 1)
    }
    const onLeave = () => {
      rawX.set(0)
      rawY.set(0)
    }
    addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [reduce, rawX, rawY])

  return <PointerContext.Provider value={{ mx, my, unit }}>{children}</PointerContext.Provider>
}

/**
 * Hacia dónde puede moverse una capa. Los objetos cortados por el borde de la
 * ventana solo se mueven hacia fuera, para que nunca se vea el corte.
 */
export type Travel = 'both' | 'neg' | 'pos'

function offset(m: number, depth: number, travel: Travel) {
  if (travel === 'neg') return (-depth * (1 + m)) / 2
  if (travel === 'pos') return (depth * (1 - m)) / 2
  return -m * depth
}

export type Rect = { x: number; y: number; w: number; h: number }

export function Decor({
  src,
  rect,
  depth = 0,
  travelX = 'both',
  travelY = 'both',
  z,
  wind,
  scale = 1,
  className = '',
  hint,
  decorative = true,
  print,
  tambalea = false,
  children,
}: {
  src?: string
  rect: Rect
  depth?: number
  travelX?: Travel
  travelY?: Travel
  z: number
  /** Balanceo por viento: punto de giro (en %), amplitud (grados) y periodo (s). */
  wind?: { origin: string; amp: number; period: number; delay?: number }
  scale?: number
  className?: string
  /** Frase que aparece al pasar el ratón por el objeto. */
  hint?: HintText
  /** false cuando la capa lleva contenido con significado (p. ej. la cita). */
  decorative?: boolean
  /** Copia fotográfica con marco de papel: giro (grados) y encuadre (object-position). */
  print?: { rotate: number; position?: string }
  /** Al pulsarlo, el objeto se tambalea (la taza). */
  tambalea?: boolean
  children?: ReactNode
}) {
  const ctx = useContext(PointerContext)
  const fallback = useMotionValue(0)
  const mx = ctx?.mx ?? fallback
  const my = ctx?.my ?? fallback
  const unit = ctx?.unit ?? 1
  const x = useTransform(mx, m => offset(m, depth, travelX) * unit)
  const y = useTransform(my, m => offset(m, depth, travelY) * unit)
  const [golpes, setGolpes] = useState(0)

  const img = !src ? null : print ? (
    <div className={s.print} style={{ transform: `rotate(${print.rotate}deg)` }}>
      <img className={s.photo} src={src} alt="" draggable={false} decoding="async" style={{ objectPosition: print.position }} />
    </div>
  ) : tambalea ? (
    // la key nueva reinicia la animación en cada clic (objeto decorativo, oculto a lectores de pantalla)
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div key={golpes} className={`${s.tambalea} ${golpes ? s.golpe : ''}`} onClick={() => setGolpes(g => g + 1)}>
      <img className={s.img} src={src} alt="" draggable={false} decoding="async" />
    </div>
  ) : (
    <img className={s.img} src={src} alt="" draggable={false} decoding="async" />
  )
  return (
    <motion.div
      className={`${s.layer} ${className}`}
      style={{ ...box(rect.x, rect.y, rect.w, rect.h), zIndex: z, x, y, scale }}
      aria-hidden={decorative || undefined}
    >
      <Hint hint={hint}>
        {wind ? (
          <div
            className={s.wind}
            style={
              {
                transformOrigin: wind.origin,
                '--amp': `${wind.amp}deg`,
                '--period': `${wind.period}s`,
                '--delay': `${wind.delay ?? 0}s`,
              } as CSSProperties
            }
          >
            {img}
          </div>
        ) : (
          img
        )}
      </Hint>
      {children}
    </motion.div>
  )
}
