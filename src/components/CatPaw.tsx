import type { CSSProperties } from 'react'
import pata from '../assets/decor/pata-gato.webp'
import { pistas } from '../content'
import { Hint } from './Hint'
import s from './CatPaw.module.css'

/**
 * Pata de gato (foto recortada, con su sombra natural) asomando desde el
 * borde como si curioseara la mesa. Decorativa: alt vacío y aria-hidden.
 */
export function CatPaw({
  className = '',
  style,
  withHint = false,
}: {
  className?: string
  style?: CSSProperties
  /** Frase al pasar el ratón (solo en escritorio). */
  withHint?: boolean
}) {
  return (
    <div className={`${s.paw} ${className}`} style={style} aria-hidden="true">
      <Hint hint={withHint ? pistas.pata : undefined}>
        <img className={s.img} src={pata} alt="" draggable={false} decoding="async" />
      </Hint>
    </div>
  )
}
