import { useEffect, useState } from 'react'
import { ui } from '../content'
import s from './PageShell.module.css'

/** «Volver arriba»: aparece en cuanto se baja un poco (en el móvil, casi media pantalla). */
export function BotonArriba() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(scrollY > Math.min(innerHeight, 360))
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
    <button
      type="button"
      className={`${s.arriba} ${visible ? s.arribaVisible : ''}`}
      onClick={subir}
      aria-label={ui.arriba}
      tabIndex={visible ? 0 : -1}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V6M6.5 11 12 5.5 17.5 11" />
      </svg>
    </button>
  )
}
