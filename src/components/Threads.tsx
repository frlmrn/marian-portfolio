import { forwardRef, useImperativeHandle, useMemo, useRef, type CSSProperties } from 'react'
import { animate, motionValue, useAnimationFrame, type MotionValue } from 'motion/react'
import s from './Threads.module.css'

export type Pt = { x: number; y: number }

export type ThreadDef = {
  id: string
  from: string
  to: string
  /** Construye el trazado; `t` es la tensión (1 = reposo, <1 = más tenso). */
  path: (a: Pt, b: Pt, unit: number, t: number) => string
  /** Retardo y duración del dibujo inicial (s). */
  draw: [number, number]
}

export type ThreadsHandle = { tense: (ids: string[]) => void }

const f = (n: number) => n.toFixed(1)

/** Curva colgante: cuadrática con el control desplazado hacia abajo (gravedad). */
export function sagPath(a: Pt, b: Pt, sag: number) {
  const cx = (a.x + b.x) / 2
  const cy = (a.y + b.y) / 2 + sag * 2
  return `M${f(a.x)} ${f(a.y)}Q${f(cx)} ${f(cy)} ${f(b.x)} ${f(b.y)}`
}

/** Curva cúbica con dos puntos de control (para rodear textos). */
export function cubicPath(a: Pt, c1: Pt, c2: Pt, b: Pt) {
  return `M${f(a.x)} ${f(a.y)}C${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(b.x)} ${f(b.y)}`
}

/**
 * Hilo rojo entre chinchetas. Lee cada fotograma la posición real de los
 * anclajes (que giran con las fotos) y se redibuja, así el hilo acompaña el
 * balanceo. Al cargar se dibuja de chincheta en chincheta. Las chinchetas se
 * pintan encima del hilo, que nace bajo su cabeza.
 */
export const Threads = forwardRef<
  ThreadsHandle,
  { defs: ThreadDef[]; pins: string[]; unit: number; className?: string; style?: CSSProperties }
>(function Threads({ defs, pins, unit, className = '', style }, ref) {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({})
  const shadowRefs = useRef<Record<string, SVGPathElement | null>>({})
  const pinRefs = useRef<Record<string, SVGGElement | null>>({})
  const tension = useMemo(() => {
    const m: Record<string, MotionValue<number>> = {}
    defs.forEach(d => (m[d.id] = motionValue(1)))
    return m
  }, [defs])

  useImperativeHandle(ref, () => ({
    tense(ids) {
      ids.forEach(id => {
        const t = tension[id]
        if (t) animate(t, [t.get(), 0.55, 1.12, 0.93, 1.03, 1], { duration: 1.5, ease: 'easeInOut' })
      })
    },
  }))

  useAnimationFrame(() => {
    const svg = svgRef.current
    if (!svg) return
    const origin = svg.getBoundingClientRect()
    const pos: Record<string, Pt> = {}
    svg.ownerDocument.querySelectorAll<HTMLElement>('[data-anchor]').forEach(el => {
      const r = el.getBoundingClientRect()
      pos[el.dataset.anchor!] = { x: r.left - origin.left, y: r.top - origin.top }
    })
    for (const def of defs) {
      const a = pos[def.from]
      const b = pos[def.to]
      if (!a || !b) continue
      const d = def.path(a, b, unit, tension[def.id].get())
      pathRefs.current[def.id]?.setAttribute('d', d)
      shadowRefs.current[def.id]?.setAttribute('d', d)
    }
    for (const id of pins) {
      const p = pos[id]
      const g = pinRefs.current[id]
      if (p && g) g.setAttribute('transform', `translate(${f(p.x)} ${f(p.y)}) scale(${unit})`)
    }
  })

  return (
    <svg ref={svgRef} className={`${s.threads} ${className}`} style={style} aria-hidden="true">
      <defs>
        {/* Cabeza de chincheta: cúpula con luz arriba a la izquierda */}
        <radialGradient id="pin-dome" cx="34%" cy="30%" r="75%">
          <stop offset="0" stopColor="#f0656a" />
          <stop offset="0.3" stopColor="#c8202a" />
          <stop offset="0.72" stopColor="#8f0d16" />
          <stop offset="1" stopColor="#5c060d" />
        </radialGradient>
        <linearGradient id="pin-collar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7d0a12" />
          <stop offset="1" stopColor="#4a050a" />
        </linearGradient>
        <filter id="pin-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>
      {defs.map(def => (
        <g key={def.id} style={{ '--t': `${def.draw[0]}s`, '--d': `${def.draw[1]}s` } as CSSProperties}>
          <path ref={el => void (shadowRefs.current[def.id] = el)} className={s.shadow} pathLength={1} />
          <path
            ref={el => void (pathRefs.current[def.id] = el)}
            className={s.thread}
            pathLength={1}
            strokeWidth={Math.max(1.3, unit * 2.1)}
          />
        </g>
      ))}
      {pins.map(id => (
        <g key={id} ref={el => void (pinRefs.current[id] = el)} transform="translate(-99 -99)">
          {/* Sombra de contacto (difusa) y sombra de la aguja, hacia abajo a la derecha */}
          <ellipse cx={5} cy={7} rx={10.5} ry={8} fill="rgb(45 20 10 / 0.38)" filter="url(#pin-soft)" />
          <path d="M1 3 L13 15" stroke="rgb(45 20 10 / 0.3)" strokeWidth={2.2} strokeLinecap="round" filter="url(#pin-soft)" />
          {/* Base (collar) y cúpula, ligeramente desplazada: da volumen */}
          <ellipse cx={0.6} cy={1.6} rx={9.6} ry={8.6} fill="url(#pin-collar)" />
          <circle cx={-0.6} cy={-1} r={9} fill="url(#pin-dome)" />
          {/* Brillo principal y reflejo de borde, discretos */}
          <ellipse cx={-3.6} cy={-4.6} rx={3.2} ry={2} fill="rgb(255 255 255 / 0.6)" transform="rotate(-30 -3.6 -4.6)" />
          <path d="M4.6 4.4 A6.6 6.6 0 0 0 6.8 -0.8" fill="none" stroke="rgb(255 190 185 / 0.35)" strokeWidth={1.1} strokeLinecap="round" />
        </g>
      ))}
    </svg>
  )
})
