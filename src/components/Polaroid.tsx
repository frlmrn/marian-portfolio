import { forwardRef, useImperativeHandle, useRef, type CSSProperties } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { ui, type CardItem } from '../content'
import fotoCecotec from '../assets/img/polaroid-cecotec.webp'
import fotoOhmycat from '../assets/img/polaroid-ohmycat.webp'
import fotoSobreMi from '../assets/img/polaroid-sobre-mi.webp'
import fotoMassolis from '../assets/img/polaroid-massolis.webp'
import fotoPath6 from '../assets/img/polaroid-path6.webp'

/** Foto de cada tarjeta (los textos alternativos están en textos/es.ts y en.ts). */
export const fotos: Partial<Record<CardItem['id'], string>> = {
  cecotec: fotoCecotec,
  ohmycat: fotoOhmycat,
  massolis: fotoMassolis,
  path6: fotoPath6,
  'sobre-mi': fotoSobreMi,
}
import { Link } from '../lib/router'
import s from './Polaroid.module.css'

export type PolaroidHandle = {
  /** Balancea la tarjeta (como al pasar el ratón). */
  sway: () => void
  /** Lleva el foco del teclado al enlace de la tarjeta. */
  focus: () => void
}

/** Punto de anclaje (en % de la tarjeta) que lee el hilo rojo. */
export type Anchor = { id: string; x: number; y: number }

/**
 * Polaroid colgada de una chincheta; es un enlace de la navegación principal.
 * Al pasar el ratón (o al enfocarla con el teclado) se balancea sobre la
 * chincheta como un péndulo amortiguado; `onSway` avisa para tensar el hilo.
 * Mientras el caso no tenga imagen definitiva, la foto queda vacía.
 */
export const Polaroid = forwardRef<
  PolaroidHandle,
  {
    item: CardItem
    rotate: number
    pivot: { x: number; y: number }
    anchors: Anchor[]
    style?: CSSProperties
    className?: string
    onSway?: () => void
  }
>(function Polaroid({ item, rotate, pivot, anchors, style, className = '', onSway }, ref) {
  const reduce = useReducedMotion()
  const sway = useMotionValue(0)
  const rotation = useTransform(sway, v => rotate + v)
  const lastSway = useRef(0)
  const cardRef = useRef<HTMLElement>(null)

  const start = () => {
    // Al balancearse la foto puede salir y volver a entrar bajo el ratón: sin rebotes encadenados
    if (reduce || performance.now() - lastSway.current < 1400) return
    lastSway.current = performance.now()
    onSway?.()
    // Impulso inicial y muelle poco amortiguado: unas cuantas oscilaciones que se apagan
    animate(sway, 0, { type: 'spring', velocity: 38, stiffness: 70, damping: 4.2, mass: 1 })
  }
  useImperativeHandle(ref, () => ({
    sway: start,
    focus: () => cardRef.current?.querySelector('a')?.focus({ preventScroll: true }),
  }))

  return (
    <motion.article
      ref={cardRef}
      className={`${s.card} ${className}`}
      style={{ ...style, rotate: rotation, originX: pivot.x / 100, originY: pivot.y / 100 }}
      onPointerEnter={e => e.pointerType === 'mouse' && start()}
      onFocus={start}
    >
      <Link
        to={item.to}
        className={s.link}
        aria-label={`${item.numero ? `${ui.caso} ${item.numero}: ` : ''}${item.nombre}, ${item.descripcion}`}
      >
        {/* Las fotos de los casos no tienen fondo: los dispositivos se apoyan en el papel */}
        <div className={s.photo} data-recorte={item.id !== 'sobre-mi' && (item.imagen ?? fotos[item.id]) ? '' : undefined}>
          {(item.imagen ?? fotos[item.id]) && (
            <img src={item.imagen ?? fotos[item.id]} alt={item.alt ?? ''} draggable={false} />
          )}
        </div>
        <div className={s.caption}>
          <div className={s.text}>
            {item.numero && <span className={s.numero}>{item.numero}</span>}
            <h3 className={s.title}>{item.nombre}</h3>
            <p className={s.desc}>{item.descripcion}</p>
          </div>
          <span className={s.arrow} aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
            </svg>
          </span>
        </div>
      </Link>
      {anchors.map(a => (
        <span key={a.id} className={s.anchor} data-anchor={a.id} style={{ left: `${a.x}%`, top: `${a.y}%` }} />
      ))}
    </motion.article>
  )
})
