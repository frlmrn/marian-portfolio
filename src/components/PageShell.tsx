import { useState, type ReactNode } from 'react'
import taza from '../assets/decor/taza.webp'
import d from './Decor.module.css'
import romero from '../assets/archivo/romero.webp'
import { ui } from '../content'
import { BotonArriba } from './BotonArriba'
import { Header } from './Header'
import s from './PageShell.module.css'

/**
 * Mesa de las páginas interiores: el mismo papel cuadriculado de la portada,
 * la cabecera, el número de página y solo dos objetos (chai y romero), que
 * entran cortados por los bordes de la pantalla.
 */
export function PageShell({
  numero,
  children,
  className = '',
}: {
  numero: string
  children: ReactNode
  className?: string
}) {
  const [golpes, setGolpes] = useState(0)
  return (
    <div className={`papel ${s.page} ${className}`}>
      {/* La taza entera, apoyada en la esquina de la mesa; al pulsarla se tambalea */}
      <span
        key={golpes}
        className={`${s.chai} ${golpes ? d.golpe : ''}`}
        aria-hidden="true"
        onClick={() => setGolpes(g => g + 1)}
      >
        <img src={taza} alt="" />
      </span>
      <img className={s.romero} src={romero} alt="" aria-hidden="true" />
      <Header variant="flow" />
      <p className={s.numero} aria-label={ui.pagina(numero)}>
        {numero}
      </p>
      <main className={s.main}>{children}</main>
      <BotonArriba />
    </div>
  )
}
