import { useId, type CSSProperties } from 'react'
import { ui } from '../content'
import { Link, paths } from '../lib/router'
import s from './SelloContacto.module.css'

/**
 * Sello de goma en azul marino estampado en la mesa, junto a la polaroid de «Sobre mí»:
 * «Ponte en contacto» alrededor y «Hablemos» en el centro. Lleva al contacto.
 * La tinta irregular sale de un filtro de ruido, como un sello de verdad.
 */
export function SelloContacto({ className = '', style }: { className?: string; style?: CSSProperties }) {
  const id = useId().replace(/:/g, '')
  const t = ui.sello
  return (
    <Link to={paths.contacto} className={`${s.sello} ${className}`} style={style} aria-label={t.etiqueta}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <path id={`${id}-arco`} d="M60 60 m-41 0 a41 41 0 1 1 82 0 a41 41 0 1 1 -82 0" />
          <filter id={`${id}-tinta`} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="ruido" />
            <feColorMatrix in="ruido" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.45" result="huecos" />
            <feComposite in="SourceGraphic" in2="huecos" operator="in" result="tinta" />
            <feDisplacementMap in="tinta" in2="ruido" scale="1.6" />
          </filter>
        </defs>
        <g filter={`url(#${id}-tinta)`}>
          <circle className={s.aro} cx="60" cy="60" r="55" />
          <circle className={s.aroFino} cx="60" cy="60" r="50.5" />
          <circle className={s.aroFino} cx="60" cy="60" r="32" />
          <text className={s.arco}>
            <textPath href={`#${id}-arco`} textLength="252">
              {t.arco}
            </textPath>
          </text>
          {/* Sobre pequeño y la palabra del centro */}
          <path className={s.icono} d="M47 44 h26 v16 h-26 z M47 44 l13 10 13 -10" />
          <text className={s.centro} x="60" y="76" textAnchor="middle">
            {t.centro}
          </text>
        </g>
      </svg>
    </Link>
  )
}
