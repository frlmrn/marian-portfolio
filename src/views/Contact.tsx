import { useId, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { contacto, pages, ui } from '../content'
import { PageShell } from '../components/PageShell'
import { Logo } from '../components/Header'
import p from '../components/PageShell.module.css'
import s from './Contact.module.css'

type Campos = { nombre: string; email: string; idea: string }
type Errores = Partial<Record<keyof Campos, string>>

function validar(c: Campos): Errores {
  const e: Errores = {}
  if (!c.nombre.trim()) e.nombre = ui.form.faltaNombre
  if (!c.email.trim()) e.email = ui.form.faltaEmail
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim()))
    e.email = ui.form.emailMal
  if (!c.idea.trim()) e.idea = ui.form.faltaIdea
  return e
}

/**
 * Clave pública de Web3Forms: lleva los mensajes a frlmrn13@gmail.com. Sin ella, el
 * formulario abre el programa de correo. No es secreta: el servicio la pide en la web.
 */
const CLAVE_FORMULARIO = ''

/**
 * Ficha de proyecto: el formulario de contacto (compartido por la versión en
 * columna y la de escritorio). Medidas en em: la versión de escritorio la
 * escala con el tamaño de la mesa.
 */
export function ContactForm({
  className = '',
  style,
  children,
}: {
  className?: string
  style?: CSSProperties
  /** Piezas extra encima de la ficha (cinta, anclajes del hilo). */
  children?: ReactNode
}) {
  const id = useId()
  const [campos, setCampos] = useState<Campos>({ nombre: '', email: '', idea: '' })
  const [errores, setErrores] = useState<Errores>({})
  const [estado, setEstado] = useState<'' | 'enviando' | 'ok' | 'ok-correo' | 'error'>('')
  // Campo oculto: solo lo rellenan los robots
  const [trampa, setTrampa] = useState('')

  const set = (k: keyof Campos) => (v: string) => {
    setCampos(c => ({ ...c, [k]: v }))
    if (errores[k]) setErrores(e => ({ ...e, [k]: undefined }))
  }

  const enviar = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const e = validar(campos)
    setErrores(e)
    const primero = (Object.keys(e) as (keyof Campos)[])[0]
    if (primero) {
      document.getElementById(`${id}-${primero}`)?.focus()
      setEstado('')
      return
    }
    const asunto = `${ui.form.asunto} — ${campos.nombre}`
    if (!CLAVE_FORMULARIO) {
      // Sin clave (o en la versión de doble clic), el mensaje se abre en el programa de correo
      const cuerpo = `${campos.idea}\n\n${campos.nombre}\n${campos.email}`
      location.href = `mailto:${contacto.email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`
      setEstado('ok-correo')
      return
    }
    setEstado('enviando')
    try {
      const r = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: CLAVE_FORMULARIO,
          subject: asunto,
          from_name: campos.nombre,
          name: campos.nombre,
          email: campos.email,
          replyto: campos.email,
          message: campos.idea,
          botcheck: trampa,
        }),
      })
      const datos = await r.json()
      if (!datos.success) throw new Error(datos.message)
      setEstado('ok')
      setCampos({ nombre: '', email: '', idea: '' })
    } catch {
      setEstado('error')
    }
  }

  const field = (k: keyof Campos) => ({
    id: `${id}-${k}`,
    value: campos[k],
    'aria-invalid': errores[k] ? true : undefined,
    'aria-describedby': errores[k] ? `${id}-${k}-error` : undefined,
  })
  const error = (k: keyof Campos) =>
    errores[k] && (
      <p id={`${id}-${k}-error`} className={s.error}>
        {errores[k]}
      </p>
    )

  return (
    <form
      className={`${p.sheet} ${s.ficha} ${className}`}
      style={style}
      onSubmit={enviar}
      noValidate
      aria-labelledby={`${id}-ficha`}
    >
      {children}
      <header className={s.fichaHead}>
        <svg viewBox="0 0 20 16" aria-hidden="true">
          <rect x="1" y="5" width="18" height="10" rx="1" />
          <path d="M3 5V2.5h7l1.2 1.4H17V5" />
        </svg>
        <h2 id={`${id}-ficha`}>{ui.form.titulo}</h2>
        <span className={s.fichaNum} aria-hidden="true">
          {ui.form.num}
        </span>
      </header>

      <div className={s.campo}>
        <label htmlFor={`${id}-nombre`}>{ui.form.nombre}</label>
        <input {...field('nombre')} type="text" autoComplete="name" onChange={e => set('nombre')(e.target.value)} />
        {error('nombre')}
      </div>
      <div className={s.campo}>
        <label htmlFor={`${id}-email`}>{ui.form.email}</label>
        <input {...field('email')} type="email" autoComplete="email" onChange={e => set('email')(e.target.value)} />
        {error('email')}
      </div>
      <div className={`${s.campo} ${s.campoIdea}`}>
        <label htmlFor={`${id}-idea`}>{ui.form.idea}</label>
        <textarea
          {...field('idea')}
          rows={5}
          onChange={e => set('idea')(e.target.value)}
        />
        {error('idea')}
      </div>

      <input
        className={s.trampa}
        type="text"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={trampa}
        onChange={e => setTrampa(e.target.value)}
      />
      <button type="submit" className={`${p.button} ${s.enviar}`} disabled={estado === 'enviando'}>
        {estado === 'enviando' ? ui.form.enviando : contacto.boton}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
      </button>

      {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- es un aviso, no el resultado de un cálculo */}
      <p className={s.estado} role="status">
        {estado === 'ok' && ui.form.ok}
        {estado === 'ok-correo' && ui.form.okCorreo}
        {estado === 'error' && (
          <>
            {ui.form.errorEnvio} <a href={`mailto:${contacto.email}`}>{contacto.email}</a>.
          </>
        )}
      </p>
    </form>
  )
}

/**
 * Sobre dirigido a Marian: su correo, su teléfono (abre WhatsApp) y su
 * LinkedIn, con un sello del logo y el matasellos de Sevilla. Es el
 * contacto directo, sin formulario.
 */
export function Sobre({ className = '', style }: { className?: string; style?: CSSProperties }) {
  // wa.me necesita solo los dígitos, con el prefijo del país
  const whatsapp = `https://wa.me/${contacto.telefono.replace(/\D/g, '')}`
  return (
    <section className={`${s.sobre} ${className}`} style={style} aria-labelledby="sobre-titulo">
      <h2 id="sobre-titulo" className="sr-only">
        {contacto.sobre.titulo}
      </h2>
      <span className={s.sello} aria-hidden="true">
        <Logo className={s.selloLogo} />
      </span>
      <Matasellos className={s.matasellos} />
      <div className={s.direccion}>
        <p className={s.para}>{contacto.sobre.para}</p>
        <p className={s.destinatario}>Marian López Solís</p>
        <p>
          <a href={`mailto:${contacto.email}`}>{contacto.email}</a>
        </p>
        <p>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${contacto.sobre.whatsapp} ${contacto.telefono}`}
          >
            <svg className={s.wa} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.6 18.6Z" />
              <path d="M9.2 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c.6 1.1 1.4 1.9 2.5 2.5l.6-.5c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.6.8-.6.3-1.6.4-3-.4-1.6-.9-2.9-2.2-3.7-3.8-.7-1.3-.6-2.3-.3-2.8Z" />
            </svg>
            {contacto.telefono}
          </a>
        </p>
        <p>
          <a href={contacto.linkedin} target="_blank" rel="noopener noreferrer">
            {contacto.sobre.linkedin}
          </a>
        </p>
        <p className={s.ciudad}>{contacto.sobre.ciudad}</p>
      </div>
    </section>
  )
}

/** Matasellos de tinta azul marino: Sevilla y el año, con las ondas de cancelación. */
/** Año del matasellos (se calcula una vez, no en cada render) */
const ANIO = new Date().getFullYear()

function Matasellos({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 110" aria-hidden="true">
      <defs>
        <path id="matasellos-arco" d="M55 55 m-37 0 a37 37 0 1 1 74 0 a37 37 0 1 1 -74 0" />
      </defs>
      <circle cx="55" cy="55" r="48" />
      <circle cx="55" cy="55" r="29" />
      <text>
        <textPath href="#matasellos-arco">SEVILLA · ARCHIVO · SEVILLA · ARCHIVO ·</textPath>
      </text>
      <text x="55" y="60" textAnchor="middle" className="anio">
        {ANIO}
      </text>
      <path d="M108 30 q14 -8 28 0 t28 0 t28 0 t28 0 M108 48 q14 -8 28 0 t28 0 t28 0 t28 0 M108 66 q14 -8 28 0 t28 0 t28 0 t28 0 M108 84 q14 -8 28 0 t28 0 t28 0 t28 0" />
    </svg>
  )
}

/**
 * Contacto: titular en una hoja rasgada y la «ficha de proyecto» como
 * formulario. Mientras no haya correo configurado (contacto.email), el envío
 * avisa de que el formulario aún no está conectado; con correo, abre el
 * programa de correo con el mensaje ya redactado.
 */
export function Contact() {
  const page = pages.contacto
  return (
    <PageShell numero={page.numero}>
      <div className={s.layout}>
        <section className={s.intro} aria-labelledby="titulo">
          <div className={s.torn}>
            <h1 id="titulo" className={p.title}>
              {page.titulo.map(l => (
                <span key={l} className={s.line}>
                  {l}{' '}
                </span>
              ))}
            </h1>
            <p className={p.lead}>
              {contacto.texto.map(l => (
                <span key={l} className={s.line}>
                  {l}{' '}
                </span>
              ))}
            </p>
          </div>
          <section className={s.pasos} aria-labelledby="empezar">
            <span className={p.tape} style={{ left: '38%', top: -12, width: 80, height: 26, rotate: '3deg' }} />
            <h2 id="empezar" className={s.pasosTitle}>
              {ui.empezar}
            </h2>
            <ol>
              {contacto.pasos.map((t, i) => (
                <li key={t}>
                  <span className={s.pasoNum} aria-hidden="true">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
          </section>
          <p className={`${p.note} ${s.nota}`}>
            {contacto.nota.map(l => (
              <span key={l}>{l}</span>
            ))}
          </p>
        </section>

        <div className={s.columnaFicha}>
          <ContactForm>
            <span className={p.tape} style={{ right: '12%', top: -14, width: 90, height: 28, rotate: '5deg' }} />
          </ContactForm>
          <Sobre />
        </div>
      </div>
    </PageShell>
  )
}
