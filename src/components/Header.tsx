import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import logo from '../assets/img/logo-reloj-gato.svg?raw'
import { box } from '../lib/layout'
import { ui, type Idioma } from '../content'
import { useIdioma } from '../lib/idioma'
import { Link, paths, useRouter, type PageName } from '../lib/router'
import s from './Header.module.css'

const tabs: PageName[] = ['inicio', 'sobre-mi', 'casos', 'contacto']

const idiomas: { id: Idioma; corto: string; nombre: string }[] = [
  { id: 'es', corto: 'ES', nombre: 'Español' },
  { id: 'en', corto: 'EN', nombre: 'English' },
]

/** Al salir con el ratón, el fichero espera un poco antes de cerrarse. */
const CLOSE_DELAY = 260

export function Logo({ className }: { className?: string }) {
  return <span className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: logo }} />
}

/**
 * Cabecera discreta y transparente: marca y, sobre un recorte de papel con
 * cinta (para que se lea igual sobre la hoja o sobre la madera), el «Índice»,
 * que al pasar el ratón o al pulsarlo despliega las secciones como fichas de
 * un fichero, y el selector de idioma ES / EN.
 * Es la navegación secundaria; la principal son las polaroids.
 */
export function Header({ variant }: { variant: 'stage' | 'flow' }) {
  const { page } = useRouter()
  const { idioma, cambiar } = useIdioma()
  const stage = variant === 'stage'
  const [open, setOpen] = useState(false)
  const listId = useId()
  const navRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<number>(undefined)
  // En columna la cabecera se queda fija arriba; al bajar, aparece una tira de papel detrás
  const [pegada, setPegada] = useState(false)

  useEffect(() => {
    if (stage) return
    const onScroll = () => setPegada(scrollY > 8)
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [stage])

  const show = () => {
    clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const hideSoon = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(false)
    }
    addEventListener('keydown', onKey)
    addEventListener('pointerdown', onDown)
    return () => {
      removeEventListener('keydown', onKey)
      removeEventListener('pointerdown', onDown)
    }
  }, [open])

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  return (
    <header
      className={`${s.header} ${stage ? s.stage : s.flow} ${pegada ? s.pegada : ''}`}
      style={stage ? box(196, 30) : undefined}
    >
      {!stage && <span className={s.tira} aria-hidden="true" />}
      <Link to={paths.inicio} className={s.brand} aria-label={ui.irInicio}>
        <Logo className={s.logo} />
        <span className={s.name}>Marian</span>
      </Link>

      <div className={s.derecha}>
        <span className={s.recorte} aria-hidden="true" />
        {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Esc cierra el índice desde cualquier enlace */}
        <nav
          ref={navRef}
          className={`${s.nav} ${open ? s.open : ''}`}
          aria-label={ui.secciones}
          onPointerEnter={e => e.pointerType === 'mouse' && show()}
          onPointerLeave={e => e.pointerType === 'mouse' && hideSoon()}
          onBlur={e => {
            if (!navRef.current?.contains(e.relatedTarget as Node)) setOpen(false)
          }}
        >
          <button
            ref={buttonRef}
            type="button"
            className={s.trigger}
            aria-expanded={open}
            aria-controls={listId}
            onClick={() => (open ? setOpen(false) : show())}
          >
            <svg className={s.icon} viewBox="0 0 20 16" aria-hidden="true">
              <rect x="1" y="5" width="18" height="10" rx="1" />
              <path d="M3 5V2.5h7l1.2 1.4H17V5" />
              <path d="M5 9h6" />
            </svg>
            {ui.indice}
          </button>

          <ul id={listId} className={s.cards}>
            {tabs.map((t, i) => {
              const active = t === page
              return (
                <li key={t} style={{ '--i': i } as CSSProperties}>
                  <Link
                    to={paths[t]}
                    className={`${s.card} ${active ? s.active : ''}`}
                    aria-current={active ? 'page' : undefined}
                    tabIndex={open ? undefined : -1}
                    onClick={() => setOpen(false)}
                  >
                    <span className={s.num} aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {ui.menu[t]}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- un fieldset obligaría a una leyenda visible */}
        <div className={s.idioma} role="group" aria-label={ui.idioma}>
          {idiomas.map(i => (
            <button
              key={i.id}
              type="button"
              lang={i.id}
              className={s.lang}
              aria-pressed={idioma === i.id}
              aria-label={i.nombre}
              onClick={() => cambiar(i.id)}
            >
              {i.corto}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
