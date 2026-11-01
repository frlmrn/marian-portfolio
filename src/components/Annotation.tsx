import type { CSSProperties } from 'react'
import s from './Annotation.module.css'

/**
 * Anotación de archivo: texto editorial pequeño (Ibarra Real Nova cursiva) que aparece
 * con un fundido suave al cargar. Sustituye a la letra manuscrita.
 */
export function Annotation({
  lines,
  delay = 0,
  className = '',
  style,
}: {
  lines: string[]
  delay?: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <p className={`${s.note} ${className}`} style={{ ...style, '--t': `${delay}s` } as CSSProperties}>
      {lines.map((l, i) => (
        <span key={i}>{l}</span>
      ))}
    </p>
  )
}

/**
 * Flecha fina y algo curva, de una anotación a lo que señala. Todas las notas de
 * la portada usan esta. Coordenadas en unidades de la imagen.
 */
export function Leader({
  from,
  to,
  curva = 0.22,
  delay = 0,
  className = '',
}: {
  from: [number, number]
  to: [number, number]
  /** Cuánto se arquea y hacia qué lado (negativo, al contrario). */
  curva?: number
  delay?: number
  className?: string
}) {
  const pad = 14
  const x0 = Math.min(from[0], to[0]) - pad
  const y0 = Math.min(from[1], to[1]) - pad
  const w = Math.abs(to[0] - from[0]) + pad * 2
  const h = Math.abs(to[1] - from[1]) + pad * 2
  const [ax, ay] = [from[0] - x0, from[1] - y0]
  const [bx, by] = [to[0] - x0, to[1] - y0]
  // punto de control, a un lado de la recta entre los dos extremos
  const cx = (ax + bx) / 2 - (by - ay) * curva
  const cy = (ay + by) / 2 + (bx - ax) * curva
  // la punta sigue la dirección con la que llega la curva
  const angulo = Math.atan2(by - cy, bx - cx)
  const punta = (giro: number) => `${bx - 8 * Math.cos(angulo + giro)} ${by - 8 * Math.sin(angulo + giro)}`
  return (
    <svg
      className={`${s.leader} ${className}`}
      viewBox={`0 0 ${w} ${h}`}
      style={
        {
          left: `calc(var(--u) * ${x0})`,
          top: `calc(var(--u) * ${y0})`,
          width: `calc(var(--u) * ${w})`,
          height: `calc(var(--u) * ${h})`,
          '--t': `${delay}s`,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <path d={`M${ax} ${ay}Q${cx} ${cy} ${bx} ${by}`} pathLength={1} />
      <path className={s.punta} d={`M${punta(0.5)}L${bx} ${by}L${punta(-0.5)}`} />
    </svg>
  )
}
