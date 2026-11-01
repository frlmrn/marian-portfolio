import { ui } from '../content'
import { PageShell } from '../components/PageShell'
import p from '../components/PageShell.module.css'
import { Link, paths, type PageName } from '../lib/router'
import s from './NoEncontrado.module.css'

/** Dirección que no existe: una hoja rasgada que lo dice y las cuatro secciones para seguir. */
export function NoEncontrado() {
  const t = ui.noEncontrado
  const secciones: PageName[] = ['inicio', 'sobre-mi', 'casos', 'contacto']
  return (
    <PageShell numero="404">
      <section className={s.hoja} aria-labelledby="titulo">
        <span className={p.tape} style={{ left: '14%', top: -14, width: 96, height: 30, rotate: '-5deg' }} />
        <p className={s.rotulo}>{t.rotulo}</p>
        <h1 id="titulo" className={s.titulo}>
          {t.h1[0]} <span>{t.h1[1]}</span>
        </h1>
        <p className={s.texto}>{t.texto}</p>
        <nav aria-label={ui.secciones}>
          <ul className={s.secciones}>
            {secciones.map(k => (
              <li key={k}>
                <Link to={paths[k]} className={k === 'inicio' ? p.button : s.enlace}>
                  {ui.menu[k]}
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>
      <p className={`${p.note} ${s.nota}`}>
        {t.nota.map(l => (
          <span key={l}>{l}</span>
        ))}
      </p>
    </PageShell>
  )
}
