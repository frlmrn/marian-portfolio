import { useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { sobreMi, ui } from '../content'
import { VisorReferencia } from './Referencia'
import s from './Archivo.module.css'

/*
 * Objetos de «Sobre mí»: un cajón de fichero con la experiencia, una carpeta
 * fichero con las herramientas y los diplomas de formación. Medidas en em:
 * la versión de escritorio las escala con la mesa y la de móvil usa el
 * tamaño base.
 */

export type Ficha = { id: string; tab: ReactNode; label: string; body: ReactNode }

/**
 * Fichero de verdad: cada ficha lleva su pestaña pegada y las fichas están
 * escalonadas en profundidad (las de atrás asoman algo más arriba). Al pasar
 * el ratón por una pestaña (o enfocarla o pulsarla) esa ficha pasa delante;
 * las demás no se mueven. Patrón de pestañas accesible: flechas para
 * moverse y una sola pestaña en el orden de tabulación.
 */
export function Fichas({
  fichas,
  inicial = 0,
  variante,
  alto,
  filas = 1,
  children,
}: {
  fichas: Ficha[]
  inicial?: number
  variante: 'cajon' | 'carpeta'
  /** Alto de las fichas (p. ej. '18em'), si el contenido es más largo que el de Sobre mí. */
  alto?: string
  /** Pestañas escalonadas en varias alturas, como los separadores de un fichero (para muchas fichas). */
  filas?: 1 | 2
  /** El objeto que las contiene (frente del cajón, tapa de la carpeta…). */
  children: ReactNode
}) {
  const [activa, setActiva] = useState(inicial)
  const uid = useId()
  const n = fichas.length

  return (
    <div
      className={`${s.objeto} ${s[variante]} ${filas > 1 ? s.escalonado : ''}`}
      style={{ '--n': n, '--cols': Math.ceil(n / filas), ...(alto ? { '--hojaH': alto } : {}) } as CSSProperties}
    >
      <div className={s.fondo} aria-hidden="true" />
      <div className={s.hojas} role="tablist">
        {fichas.map((f, i) => {
          const on = i === activa
          return (
            <div
              key={f.id}
              role="presentation"
              className={`${s.hoja} ${on ? s.on : ''}`}
              style={{ '--i': i, '--col': Math.floor(i / filas), '--fila': i % filas, zIndex: on ? n + 1 : n - i } as CSSProperties}
            >
              <button
                type="button"
                role="tab"
                id={`${uid}-t${i}`}
                aria-selected={on}
                aria-controls={`${uid}-p${i}`}
                aria-label={f.label}
                tabIndex={on ? 0 : -1}
                className={s.pestana}
                onPointerEnter={e => e.pointerType === 'mouse' && setActiva(i)}
                onFocus={() => setActiva(i)}
                onClick={() => setActiva(i)}
                onKeyDown={e => {
                  const d =
                    e.key === 'ArrowRight' || e.key === 'ArrowDown'
                      ? 1
                      : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
                        ? -1
                        : 0
                  if (!d) return
                  e.preventDefault()
                  const next = (activa + d + n) % n
                  setActiva(next)
                  document.getElementById(`${uid}-t${next}`)?.focus()
                }}
              >
                {f.tab}
              </button>
              <div
                role="tabpanel"
                id={`${uid}-p${i}`}
                aria-labelledby={`${uid}-t${i}`}
                hidden={!on}
                className={s.contenido}
              >
                {f.body}
              </div>
            </div>
          )
        })}
      </div>
      <div className={s.frente} aria-hidden="true">
        {children}
      </div>
    </div>
  )
}

/** Cajón de fichero con la experiencia: una ficha por puesto. */
export function FicheroExperiencia() {
  const visor = useRef<HTMLDialogElement>(null)
  const fichas: Ficha[] = sobreMi.trayectoria.map(t => ({
    id: t.lugar,
    label: `${t.fecha}: ${t.puesto}, ${t.lugar}`,
    tab: (
      <>
        <span className={s.tabYear}>{t.fecha.match(/\d{4}/)?.[0]}</span>
        <span className={s.tabSub}>{t.corto}</span>
      </>
    ),
    body: (
      <>
        <p className={s.fecha}>{t.fecha}</p>
        {t.referencia && (
          <button type="button" className={s.clipRef} aria-label={ui.referencia.abrir} onClick={() => visor.current?.showModal()}>
            <svg viewBox="0 0 16 34" aria-hidden="true">
              <path d="M11.5 8v18a3.5 3.5 0 0 1-7 0V6a2.5 2.5 0 0 1 5 0v18a1 1 0 0 1-2 0V9" />
            </svg>
            {ui.referencia.clip}
          </button>
        )}
        <h3 className={s.puesto}>{t.puesto}</h3>
        <p className={s.lugar}>{t.lugar}</p>
        <p className={s.detalle}>{t.detalle}</p>
      </>
    ),
  }))
  return (
    <>
      <Fichas variante="cajon" fichas={fichas}>
        <span className={s.portaEtiqueta}>
          <span>{ui.dondeHeTrabajado}</span>
        </span>
        <span className={s.tirador} />
      </Fichas>
      <VisorReferencia ref={visor} />
    </>
  )
}

/** Carpeta fichero (de fuelle) con las herramientas; IA abierta de inicio. */
export function CarpetaHerramientas() {
  const grupos = sobreMi.herramientas
  const fichas: Ficha[] = grupos.map(g => ({
    id: g.id,
    label: `${ui.herramientas}: ${g.grupo}`,
    tab: <span className={s.tabGrupo}>{g.corto}</span>,
    body: (
      <>
        <h3 className={s.grupoTitle}>{g.grupo}</h3>
        <ul className={`${s.items} ${g.id === 'ia' ? s.ia : ''}`}>
          {g.items.map((it, i) => (
            <li key={it} className={i === 0 ? s.destacado : undefined}>
              {it}
            </li>
          ))}
        </ul>
      </>
    ),
  }))
  return (
    <Fichas variante="carpeta" fichas={fichas} inicial={Math.max(0, grupos.findIndex(g => g.id === 'ia'))}>
      <span className={s.etiqueta}>
        <span className={s.etiquetaTit}>{ui.herramientas}</span>
        <span className={s.etiquetaSub}>{ui.ySoftware}</span>
      </span>
      {/* Cierre de botón y cordón rojo */}
      <span className={s.boton} />
      <span className={s.cordon} />
    </Fichas>
  )
}

/** Diplomas de formación, sueltos sobre la mesa; al pasar el ratón el diploma sube. */
export function Diplomas() {
  return (
    <ul className={s.diplomas}>
      {sobreMi.formacion.map((f, i) => (
        <li key={f.titulo} className={s.diploma} style={{ '--i': i } as CSSProperties}>
          <span className={s.cintaDiploma} aria-hidden="true" />
          <span className={s.lacre} aria-hidden="true" />
          <span className={s.dTitulo}>{f.titulo}</span>
          <span className={s.dCentro}>
            {f.centro} · {f.fecha}
          </span>
        </li>
      ))}
    </ul>
  )
}

/** Post-it pegado sobre un objeto: hace de título de la sección. */
export function PostIt({
  id,
  children,
  nota,
  className = '',
  style,
}: {
  id: string
  children: ReactNode
  /** Línea pequeña debajo (indicación de uso). */
  nota?: string
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={`${s.postit} ${className}`} style={style}>
      <h2 id={id} className={s.postitTit}>
        {children}
      </h2>
      {nota && (
        <p className={s.postitNota} aria-hidden="true">
          {nota}
        </p>
      )}
    </div>
  )
}

/** Datos rápidos: ciudad, disponibilidad e idiomas. */
export function Datos() {
  return (
    <ul className={s.datos}>
      {sobreMi.datos.map(d => (
        <li key={d}>{d}</li>
      ))}
    </ul>
  )
}

/** Rastro de huellas de gato (decorativo). Coordenadas en unidades de la mesa. */
export function Huellas({ pasos }: { pasos: { x: number; y: number; r: number }[] }) {
  return (
    <>
      {pasos.map((p, i) => (
        <svg
          key={i}
          className={s.huella}
          viewBox="0 0 40 40"
          aria-hidden="true"
          style={
            {
              left: `calc(var(--u) * ${p.x})`,
              top: `calc(var(--u) * ${p.y})`,
              rotate: `${p.r}deg`,
              '--d': `${0.25 * i}s`,
            } as CSSProperties
          }
        >
          <path d="M20 37c-6.5 0-11-3.4-11-8.2 0-4.5 4.6-9.6 11-9.6s11 5.1 11 9.6c0 4.8-4.5 8.2-11 8.2z" />
          <ellipse cx="7.5" cy="16" rx="3.6" ry="4.6" transform="rotate(-24 7.5 16)" />
          <ellipse cx="15" cy="8.5" rx="3.7" ry="4.9" transform="rotate(-8 15 8.5)" />
          <ellipse cx="25" cy="8.5" rx="3.7" ry="4.9" transform="rotate(8 25 8.5)" />
          <ellipse cx="32.5" cy="16" rx="3.6" ry="4.6" transform="rotate(24 32.5 16)" />
        </svg>
      ))}
    </>
  )
}
