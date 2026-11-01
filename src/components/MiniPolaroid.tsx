import type { CSSProperties } from 'react'
import { cards, type CardItem } from '../content'
import { Link } from '../lib/router'
import { fotos } from './Polaroid'
import s from './MiniPolaroid.module.css'

/**
 * Polaroid pequeña apoyada en la mesa: atajo a otra sección (p. ej. «Sobre mí»
 * desde Proyectos). Es la misma foto que la de la portada, en miniatura.
 */
export function MiniPolaroid({ id, giro = -4, style }: { id: CardItem['id']; giro?: number; style?: CSSProperties }) {
  const card = cards[id]
  const foto = card.imagen ?? fotos[id]
  return (
    <Link to={card.to} className={s.mini} style={{ ...style, rotate: `${giro}deg` }}>
      <span className={s.foto}>{foto && <img src={foto} alt="" draggable={false} />}</span>
      <span className={s.nombre}>{card.nombre}</span>
    </Link>
  )
}
