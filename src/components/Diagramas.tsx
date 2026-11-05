import { useId, useState, type CSSProperties } from 'react'
import type { Diagrama } from '../textos/es'
import s from './Diagramas.module.css'

/*
 * Diagramas de los casos dibujados aquí, con el lenguaje de la mesa (lámina
 * impresa, tinta, granate y azul marino), a partir de los del Figma: journey
 * map, arquitectura, service blueprint y benchmarking. No son capturas: el
 * texto se lee, se traduce y se adapta a cada pantalla.
 */

/** Lámina impresa que contiene un diagrama; `ancho` ocupa toda la fila. */
export function Lamina({ d, giro = 0 }: { d: Diagrama; giro?: number }) {
  const ancho = true
  return (
    <figure className={`${s.lamina} ${ancho ? s.ancho : ''}`} style={{ rotate: `${giro}deg` }} data-revela>
      <p className={s.titulo}>{d.titulo}</p>
      <div className={`${s.scroll} ${d.tipo !== 'bench' ? s.soloAncho : ''}`}>
        {d.tipo === 'journey' && <Journey d={d} />}
        {d.tipo === 'arbol' && <Arbol d={d} />}
        {d.tipo === 'blueprint' && <Blueprint d={d} />}
        {d.tipo === 'bench' && <Bench d={d} />}
      </div>
      {/* En el móvil, el mismo contenido leído de arriba abajo, sin deslizar de lado */}
      {d.tipo !== 'bench' && (
        <div className={s.soloEstrecho}>
          {d.tipo === 'journey' && <JourneyMovil d={d} />}
          {d.tipo === 'arbol' && <ArbolMovil d={d} />}
          {d.tipo === 'blueprint' && <BlueprintMovil d={d} />}
        </div>
      )}
      <figcaption className={s.pie}>{d.pie}</figcaption>
    </figure>
  )
}

/**
 * Varios diagramas del mismo tipo en una sola lámina, con pestañas para pasar
 * de uno a otro (los sitemaps de cada perfil). Patrón de pestañas accesible:
 * flechas para moverse y una sola pestaña en el orden de tabulación.
 */
export function LaminaPestanas({ titulo, ds, giro = 0 }: { titulo: string; ds: Diagrama[]; giro?: number }) {
  const [activa, setActiva] = useState(0)
  const uid = useId()
  const d = ds[activa]
  const nombre = (x: Diagrama) => (x.tipo === 'arbol' && x.pestana) || x.titulo
  return (
    <figure className={`${s.lamina} ${s.ancho}`} style={{ rotate: `${giro}deg` }} data-revela>
      <p className={s.titulo}>{titulo}</p>
      <div className={s.pestanas} role="tablist" aria-label={titulo}>
        {ds.map((x, i) => (
          <button
            key={x.titulo}
            type="button"
            role="tab"
            id={`${uid}-t${i}`}
            aria-selected={i === activa}
            aria-controls={`${uid}-p`}
            tabIndex={i === activa ? 0 : -1}
            className={`${s.pestana} ${i === activa ? s.pestanaOn : ''}`}
            onClick={() => setActiva(i)}
            onKeyDown={e => {
              const paso = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
              if (!paso) return
              e.preventDefault()
              const j = (i + paso + ds.length) % ds.length
              setActiva(j)
              document.getElementById(`${uid}-t${j}`)?.focus()
            }}
          >
            {nombre(x)}
          </button>
        ))}
      </div>
      <div id={`${uid}-p`} role="tabpanel" aria-labelledby={`${uid}-t${activa}`}>
        <div className={`${s.scroll} ${s.soloAncho}`}>{d.tipo === 'arbol' && <Arbol d={d} />}</div>
        <div className={s.soloEstrecho}>{d.tipo === 'arbol' && <ArbolMovil d={d} />}</div>
        <p className={s.pie}>{d.pie}</p>
      </div>
    </figure>
  )
}

/* ——— Journey map: tabla de etapas con sus filas y la curva de la experiencia en tinta ——— */
function Journey({ d }: { d: Extract<Diagrama, { tipo: 'journey' }> }) {
  const n = d.etapas.length
  // nivel de -2 (peor) a 2 (mejor) → altura en % de la banda
  const y = (nivel: number) => 50 - nivel * 20
  const puntos = d.etapas.map((e, i) => `${((i + 0.5) / n) * 100},${y(e.nivel)}`).join(' ')
  const fila = (f: { nombre: string; celdas: string[] }) => (
    <div key={f.nombre} className={s.jFila}>
      <span className={s.jRotulo}>{f.nombre}</span>
      {f.celdas.map((c, i) => (
        <span key={i} className={`${s.jCelda} ${d.etapas[i]?.dolor ? s.jCeldaDolor : ''}`}>
          {c}
        </span>
      ))}
    </div>
  )
  return (
    <div className={s.journey} style={{ '--n': n } as CSSProperties}>
      {d.grupos && (
        <div className={s.jFila}>
          <span />
          {d.grupos.map(g => (
            <span key={g.nombre} className={s.jGrupo} style={{ gridColumn: `span ${g.n}` }}>
              {g.nombre}
            </span>
          ))}
        </div>
      )}
      <div className={s.jFila}>
        <span />
        {d.etapas.map(e => (
          <span key={e.nombre} className={s.jFase}>
            {e.nombre}
          </span>
        ))}
      </div>
      {d.filas.slice(0, d.curvaTras).map(fila)}
      <div className={s.jFila}>
        <span className={s.jRotulo}>{d.curva}</span>
        <div className={s.banda} style={{ gridColumn: `span ${n}` }}>
          <svg className={s.curva} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="50" x2="100" y2="50" className={s.cero} />
            <polyline points={puntos} />
          </svg>
          {d.etapas.map((e, i) => (
            <span
              key={e.nombre}
              className={s.puntoCaja}
              style={{ left: `${((i + 0.5) / n) * 100}%`, top: `${y(e.nivel)}%` }}
            >
              <span className={`${s.punto} ${e.dolor ? s.dolor : ''}`} />
              {e.emocion && <span className={s.emocion}>{e.emocion}</span>}
            </span>
          ))}
        </div>
      </div>
      {d.filas.slice(d.curvaTras).map(fila)}
      {d.leyenda && (
        <p className={s.leyenda}>
          <span className={`${s.punto} ${s.dolor} ${s.puntoLeyenda}`} /> {d.leyenda}
        </p>
      )}
    </div>
  )
}

/* Journey en el móvil: la curva arriba, numerada, y una ficha por etapa */
function JourneyMovil({ d }: { d: Extract<Diagrama, { tipo: 'journey' }> }) {
  const n = d.etapas.length
  const y = (nivel: number) => 50 - nivel * 20
  const puntos = d.etapas.map((e, i) => `${((i + 0.5) / n) * 100},${y(e.nivel)}`).join(' ')
  return (
    <div>
      <p className={s.mRotulo}>{d.curva}</p>
      <div className={s.mBanda}>
        <svg className={s.curva} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line x1="0" y1="50" x2="100" y2="50" className={s.cero} />
          <polyline points={puntos} />
        </svg>
        {d.etapas.map((e, i) => (
          <span key={e.nombre} className={s.puntoCaja} style={{ left: `${((i + 0.5) / n) * 100}%`, top: `${y(e.nivel)}%` }}>
            <span className={`${s.punto} ${e.dolor ? s.dolor : ''}`} />
            <span className={s.mNum}>{i + 1}</span>
          </span>
        ))}
      </div>
      <ol className={s.mEtapas}>
        {d.etapas.map((e, i) => (
          <li key={e.nombre} className={e.dolor ? s.mDolor : undefined}>
            <p className={s.mEtapa}>
              <span>{i + 1}</span> {e.nombre}
            </p>
            {d.filas.map(f =>
              f.celdas[i] && f.celdas[i] !== '—' ? (
                <p key={f.nombre} className={s.mDato}>
                  <span className={s.mRotulo}>{f.nombre}</span>
                  {f.celdas[i]}
                </p>
              ) : null,
            )}
          </li>
        ))}
      </ol>
      {d.leyenda && (
        <p className={s.leyenda}>
          <span className={`${s.punto} ${s.dolor} ${s.puntoLeyenda}`} /> {d.leyenda}
        </p>
      )}
    </div>
  )
}

/* Arquitectura en el móvil: el árbol en vertical, cada rama con sus pantallas debajo */
function ArbolMovil({ d }: { d: Extract<Diagrama, { tipo: 'arbol' }> }) {
  const rama = (r: { nombre: string; hijos?: string[]; nuevo?: boolean }) => (
    <li key={r.nombre} className={r.nuevo ? s.nuevo : undefined}>
      <p className={s.nodo}>{r.nombre}</p>
      {r.hijos && (
        <ul className={s.mHijos}>
          {r.hijos.map(h => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      )}
    </li>
  )
  return (
    <div className={s.mArbol}>
      <p className={s.raiz}>{d.raiz}</p>
      <ul className={s.mRamas}>{d.ramas.map(rama)}</ul>
      {d.aparte && <ul className={`${s.mRamas} ${s.mAparte}`}>{d.aparte.map(rama)}</ul>}
      {d.leyenda && (
        <p className={s.leyenda}>
          <span className={s.marcaNuevo} /> {d.leyenda}
        </p>
      )}
    </div>
  )
}

/* Blueprint en el móvil: una ficha por fase con lo que pasa en cada carril */
function BlueprintMovil({ d }: { d: Extract<Diagrama, { tipo: 'blueprint' }> }) {
  return (
    <>
      <ol className={s.mEtapas}>
        {d.fases.map((f, i) => (
          <li key={f}>
            <p className={s.mEtapa}>
              <span>{i + 1}</span> {f}
              {d.tiempos && <span className={s.tiempo}>{d.tiempos[i]}</span>}
            </p>
            {d.carriles.map(c =>
              c.celdas[i] && c.celdas[i] !== '—' ? (
                <p key={c.nombre} className={`${s.mDato} ${d.mejora?.fila === c.nombre && d.mejora.col === i ? s.mMejora : ''}`}>
                  <span className={s.mRotulo}>{c.nombre}</span>
                  {c.celdas[i]}
                </p>
              ) : null,
            )}
          </li>
        ))}
      </ol>
      {d.mejora && (
        <p className={s.leyenda}>
          <span className={s.marcaMejora} /> {d.mejora.texto}
        </p>
      )}
    </>
  )
}

/* ——— Arquitectura: árbol de navegación dibujado en tinta ——— */
function Arbol({ d }: { d: Extract<Diagrama, { tipo: 'arbol' }> }) {
  return (
    <div className={s.arbol}>
      <p className={s.raiz}>{d.raiz}</p>
      <ul className={s.ramas} style={{ '--n': d.ramas.length } as CSSProperties}>
        {d.ramas.map(r => (
          <li key={r.nombre} className={r.nuevo ? s.nuevo : undefined}>
            <p className={s.nodo}>{r.nombre}</p>
            {r.hijos && (
              <ul className={s.hijos}>
                {r.hijos.map(h => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {d.aparte && (
        <ul className={s.aparte}>
          {d.aparte.map(r => (
            <li key={r.nombre} className={r.nuevo ? s.nuevo : undefined}>
              <p className={s.nodo}>{r.nombre}</p>
              {r.hijos && <p className={s.aparteHijos}>{r.hijos.join(' · ')}</p>}
            </li>
          ))}
        </ul>
      )}
      {d.leyenda && (
        <p className={s.leyenda}>
          <span className={s.marcaNuevo} /> {d.leyenda}
        </p>
      )}
    </div>
  )
}

/* ——— Service blueprint: carriles y líneas de interacción y visibilidad ——— */
function Blueprint({ d }: { d: Extract<Diagrama, { tipo: 'blueprint' }> }) {
  return (
    <>
      <table className={s.blueprint}>
        <thead>
          <tr>
            {/* esquina vacía de la tabla */}
            {/* oxlint-disable-next-line jsx-a11y/control-has-associated-label */}
            <td />
            {d.fases.map((f, i) => (
              <th key={f} scope="col">
                {f}
                {d.tiempos && <span className={s.tiempo}>{d.tiempos[i]}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {d.carriles.map(c => (
            <tr key={c.nombre} className={c.linea ? s.conLinea : undefined} data-linea={c.linea}>
              <th scope="row">{c.nombre}</th>
              {c.celdas.map((x, i) => (
                <td key={i} className={d.mejora?.fila === c.nombre && d.mejora.col === i ? s.mejora : undefined}>
                  {x}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {d.mejora && (
        <p className={s.leyenda}>
          <span className={s.marcaMejora} /> {d.mejora.texto}
        </p>
      )}
    </>
  )
}

/* ——— Benchmarking: los criterios agrupados por resultado, en fichas con su recuento ——— */
function Bench({ d }: { d: Extract<Diagrama, { tipo: 'bench' }> }) {
  const grupos = (['no', 'parcial', 'na', 'si'] as const)
    .map(k => ({ k, filas: d.filas.filter(f => f.estado === k) }))
    .filter(g => g.filas.length > 0)
  return (
    <div className={s.bench}>
      <p className={s.benchResumen}>{d.resumen}</p>
      <div className={s.benchGrupos}>
        {grupos.map(g => (
          <section key={g.k} className={`${s.benchGrupo} ${s[g.k]}`}>
            <p className={s.benchCabecera}>
              <span className={s.benchCuenta}>{g.filas.length}</span>
              {d.leyenda[g.k]}
            </p>
            <ul>
              {g.filas.map(f => (
                <li key={f.criterio}>{f.criterio}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

/** Contrastes medidos, como muestras de color con su ratio (guía de estilo). */
export function Contrastes({ pares }: { pares: { texto: string; fondo: string; tinta: string; ratio: string }[] }) {
  return (
    <ul className={s.contrastes}>
      {pares.map((c, i) => (
        <li key={c.texto} style={{ rotate: `${[-1.2, 1, -0.6, 1.4][i % 4]}deg` }}>
          <span className={s.muestra} style={{ background: c.fondo, color: c.tinta }}>
            Aa
          </span>
          <span className={s.ratio}>{c.ratio}</span>
          <span className={s.contrasteTexto}>{c.texto}</span>
          <span className={s.aa}>AA</span>
        </li>
      ))}
    </ul>
  )
}
