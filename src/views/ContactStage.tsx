import { contacto, pages, ui } from '../content'
import { StageShell } from '../components/StageShell'
import { MiniPolaroid } from '../components/MiniPolaroid'
import { sagPath, type ThreadDef } from '../components/Threads'
import { box, u } from '../lib/layout'
import { ContactForm, Sobre } from './Contact'
import h from './Home.module.css'
import s from './ContactStage.module.css'

/* El hilo va de la hoja del titular a la ficha de proyecto */
const threads: ThreadDef[] = [
  { id: 'A', from: 'ct1', to: 'ct2', draw: [0.5, 0.7], path: (a, b, un, t) => sagPath(a, b, 40 * un * t) },
]

/**
 * Contacto en escritorio: la mesa común con el titular en una hoja rasgada,
 * los pasos para empezar en una ficha y la «Ficha de proyecto» (formulario)
 * a la derecha, unidas por el hilo rojo.
 */
export function ContactStage({ unit }: { unit: number }) {
  const page = pages.contacto
  // En portátiles muy bajos el sobre no cabe bajo la ficha: se deja a su lado
  const alLado = unit < 0.7 && innerWidth / unit > 1900
  return (
    <StageShell unit={unit} numero={page.numero} threads={threads} pins={['ct1', 'ct2']} bocetos="contacto">
      <section className={s.torn} style={box(262, 132, 560, 380)} aria-labelledby="titulo">
        <span className={h.cinta} style={{ ...box(40, -14, 100, 34), transform: 'rotate(-6deg)' }} />
        <h1 id="titulo" className={s.title}>
          {page.titulo.map(l => (
            <span key={l}>{l} </span>
          ))}
        </h1>
        <svg className={s.underline} viewBox="0 0 300 12" aria-hidden="true">
          <path d="M3 8 C70 3 160 2 297 6" />
        </svg>
        <p className={s.lead}>
          {contacto.texto.map(l => (
            <span key={l}>{l} </span>
          ))}
        </p>
        <span className={s.anchor} data-anchor="ct1" style={{ left: '94%', top: '88%' }} />
      </section>

      <section className={s.pasos} style={{ ...box(318, 586, 330), minHeight: u(236) }} aria-labelledby="empezar">
        <span className={h.cinta} style={{ ...box(118, -16, 92, 32), transform: 'rotate(3deg)' }} />
        <h2 id="empezar" className={s.pasosTitle}>
          {ui.empezar}
        </h2>
        <ol>
          {contacto.pasos.map((t, i) => (
            <li key={t}>
              <span className={s.num} aria-hidden="true">
                {i + 1}
              </span>
              {t}
            </li>
          ))}
        </ol>
      </section>

      {/* Entre los pasos y la ficha: la nota señala el formulario */}
      <p className={s.nota} style={box(674, 640)}>
        {contacto.nota.map(l => (
          <span key={l}>{l}</span>
        ))}
      </p>
      <svg className={s.arrow} style={box(712, 560, 120, 70)} viewBox="0 0 120 70" aria-hidden="true">
        <path d="M8 64 C24 30 62 14 110 14 M110 14 l-12 -7 M110 14 l-11 8" />
      </svg>

      <ContactForm className={s.ficha} style={box(860, 104, 452)}>
        <span className={h.cinta} style={{ ...box(300, -16, 96, 32), transform: 'rotate(5deg)' }} />
        <span className={s.anchor} data-anchor="ct2" style={{ left: '5%', top: '4%' }} />
        {/* El sobre cuelga justo bajo la ficha, mida lo que mida el formulario */}
        <Sobre
          className={s.sobre}
          style={{
            left: alLado ? 'calc(100% + var(--u) * 34)' : 'calc(var(--u) * 44)',
            top: alLado ? 'calc(var(--u) * 320)' : 'calc(100% + var(--u) * 26)',
            width: 'calc(var(--u) * 360)',
          }}
        />
        {/* Atajo a Sobre mí: la polaroid pequeña, dejada encima del sobre, en su esquina libre */}
        <MiniPolaroid
          id="sobre-mi"
          giro={6}
          style={{
            left: alLado ? 'calc(100% + var(--u) * 290)' : 'calc(var(--u) * 300)',
            top: alLado ? 'calc(var(--u) * 412)' : 'calc(100% + var(--u) * 118)',
            width: 'calc(var(--u) * 104)',
            zIndex: 33,
          }}
        />
      </ContactForm>
    </StageShell>
  )
}
