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
 * Línea fina de referencia entre una anotación y lo que señala, como en un
 * documento de trabajo. Coordenadas en unidades de la imagen.
 */
export function Leader({
  from,
  to,
  delay = 0,
  className = '',
}: {
  from: [number, number]
  to: [number, number]
  delay?: number
  className?: string
}) {
  const pad = 6
  const x0 = Math.min(from[0], to[0]) - pad
  const y0 = Math.min(from[1], to[1]) - pad
  const w = Math.abs(to[0] - from[0]) + pad * 2
  const h = Math.abs(to[1] - from[1]) + pad * 2
  const [ax, ay] = [from[0] - x0, from[1] - y0]
  const [bx, by] = [to[0] - x0, to[1] - y0]
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
      <path d={`M${ax} ${ay}L${bx} ${by}`} pathLength={1} />
      <circle cx={bx} cy={by} r={2.4} />
    </svg>
  )
}
