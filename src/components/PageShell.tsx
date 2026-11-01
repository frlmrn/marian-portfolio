import { useEffect, useState, type ReactNode } from 'react'
import taza from '../assets/decor/taza.webp'
import d from './Decor.module.css'
import romero from '../assets/archivo/romero.webp'
import { ui } from '../content'
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
  // «Volver arriba» aparece cuando ya se ha bajado más de una pantalla
  const [arriba, setArriba] = useState(false)
  const [golpes, setGolpes] = useState(0)
  useEffect(() => {
    const onScroll = () => setArriba(scrollY > innerHeight)
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])
  const subir = () => {
    const suave = !matchMedia('(prefers-reduced-motion: reduce)').matches
    scrollTo({ top: 0, behavior: suave ? 'smooth' : 'auto' })
    document.querySelector<HTMLElement>('header a')?.focus({ preventScroll: true })
  }
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
      <button
        type="button"
        className={`${s.arriba} ${arriba ? s.arribaVisible : ''}`}
        onClick={subir}
        aria-label={ui.arriba}
        tabIndex={arriba ? 0 : -1}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 19V6M6.5 11 12 5.5 17.5 11" />
        </svg>
      </button>
    </div>
  )
}
