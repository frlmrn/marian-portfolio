import { forwardRef, useState } from 'react'
import es from '../assets/referencias/portillo-es.webp'
import en from '../assets/referencias/portillo-en.webp'
import { ui, type Idioma } from '../content'
import { useIdioma } from '../lib/idioma'
import { urlPublica } from '../lib/router'
import s from './Referencia.module.css'

const cartas: Record<Idioma, { img: string; pdf: string }> = {
  es: { img: es, pdf: '/referencias/referencia-grupo-portillo-es.pdf' },
  en: { img: en, pdf: '/referencias/referencia-grupo-portillo-en.pdf' },
}

/**
 * Visor de la carta de referencia de Grupo Portillo, en español y en inglés.
 * Enseña la carta como imagen (un PDF incrustado no se ve en muchos móviles)
 * y deja descargar el PDF original.
 */
export const VisorReferencia = forwardRef<HTMLDialogElement>(function VisorReferencia(_, ref) {
  const { idioma } = useIdioma()
  const [elegido, setElegido] = useState<Idioma | null>(null)
  const actual = elegido ?? idioma
  const t = ui.referencia

  return (
    // Pulsar fuera de la hoja cierra el visor; con teclado cierra Esc, de serie en dialog
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      className={s.visor}
      aria-labelledby="referencia-titulo"
      onClick={e => e.target === e.currentTarget && e.currentTarget.close()}
    >
      <div className={s.barra}>
        <h3 id="referencia-titulo" className={s.titulo}>
          {t.titulo}
        </h3>
        <div className={s.acciones}>
          {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- igual que el selector de la cabecera */}
          <div className={s.idiomas} role="group" aria-label={ui.idioma}>
            {(['es', 'en'] as const).map(k => (
              <button key={k} type="button" lang={k} aria-pressed={actual === k} onClick={() => setElegido(k)}>
                {t.idiomas[k]}
              </button>
            ))}
          </div>
          <a className={s.descargar} href={urlPublica(cartas[actual].pdf)} download>
            {t.descargar}
          </a>
          <button
            type="button"
            className={s.cerrar}
            onClick={e => e.currentTarget.closest('dialog')?.close()}
            aria-label={t.cerrar}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </div>
      <div className={s.hoja}>
        <img key={actual} src={cartas[actual].img} alt={t.alt} draggable={false} />
      </div>
    </dialog>
  )
})
