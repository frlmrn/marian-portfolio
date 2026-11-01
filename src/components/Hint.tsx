import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import s from './Hint.module.css'

/** Frase que aparece al pasar el ratón por un objeto de la mesa. */
export type HintText = {
  lines: string[]
  /** Autor y año, si es una cita. */
  autor?: string
  /** Posición de la ficha, en unidades de la imagen, respecto al objeto. */
  x: number
  y: number
  /** Hacia dónde crece la ficha desde ese punto. */
  align?: 'start' | 'end'
  /** Zona sensible ajustada a la forma del objeto (clip-path), si su caja es mucho mayor. */
  area?: string
}

const OPEN_DELAY = 120

/**
 * Envuelve un objeto decorativo: al pasar el ratón por encima aparece una
 * pequeña ficha con una frase. Es un detalle extra (solo con ratón), así que
 * queda fuera de la lectura con lector de pantalla, igual que el objeto.
 */
export function Hint({
  hint,
  children,
  className = '',
  giro = 0,
}: {
  hint?: HintText
  children: ReactNode
  className?: string
  /** Giro del objeto: la ficha lo deshace para leerse recta. */
  giro?: number
}) {
  const [open, setOpen] = useState(false)
  const timer = useRef<number>(undefined)
  if (!hint) return <>{children}</>

  const enter = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpen(true), OPEN_DELAY)
  }
  const leave = () => {
    clearTimeout(timer.current)
    setOpen(false)
  }

  return (
    <>
      <div
        className={`${s.target} ${className}`}
        style={hint.area ? { clipPath: hint.area } : undefined}
        onPointerEnter={enter}
        onPointerLeave={leave}
      >
        {children}
      </div>
      <span
        className={`${s.tip} ${open ? s.open : ''} ${hint.align === 'end' ? s.end : ''}`}
        style={{ left: `calc(var(--u) * ${hint.x})`, top: `calc(var(--u) * ${hint.y})`, rotate: `${-giro}deg`, transformOrigin: '0 0' } as CSSProperties}
      >
        {hint.lines.map(l => (
          <span key={l} className={s.line}>
            {l}
          </span>
        ))}
        {hint.autor && <span className={s.autor}>— {hint.autor}</span>}
      </span>
    </>
  )
}
