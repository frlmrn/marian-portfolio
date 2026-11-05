import type { CSSProperties, ReactNode } from 'react'
import s from './Garabatos.module.css'

/*
 * Bocetos a tinta en trozos de papel roto, en los márgenes de los casos:
 * wireframes rápidos de las pantallas de cada proyecto con una nota al lado.
 * Son decorativos (aria-hidden) y solo aparecen en pantallas anchas.
 */

const marco = (w: number, h: number) => <rect x={2} y={2} width={w - 4} height={h - 4} rx={6} />

/** Dibujos por clave; viewBox 120 × 170 (móvil) o 170 × 120 (escritorio). */
const dibujos: Record<string, { vb: string; d: ReactNode }> = {
  // ——— Cecotec (app móvil) ———
  'cec-home': {
    vb: '0 0 120 170',
    d: (
      <>
        <rect x={22} y={6} width={76} height={158} rx={10} />
        <path d="M22 26 H98 M36 16 H84" />
        <rect x={30} y={32} width={60} height={34} />
        <path className={s.fino} d="M30 32 L90 66 M90 32 L30 66" />
        <rect x={30} y={74} width={18} height={22} />
        <rect x={51} y={74} width={18} height={22} />
        <rect x={72} y={74} width={18} height={22} />
        <path d="M30 104 H78 M30 112 H66" />
        <path d="M22 140 H98" />
        <circle cx={36} cy={152} r={3} />
        <circle cx={53} cy={152} r={3} />
        <circle cx={70} cy={152} r={3} />
        <circle cx={86} cy={152} r={3} />
      </>
    ),
  },
  'cec-ceco': {
    vb: '0 0 120 170',
    d: (
      <>
        <rect x={22} y={6} width={76} height={158} rx={10} />
        <path d="M22 26 H98" />
        <rect x={28} y={62} width={64} height={62} rx={5} className={s.relleno} />
        <rect x={52} y={70} width={34} height={9} rx={4} />
        <rect x={34} y={84} width={40} height={14} rx={4} />
        <rect x={34} y={108} width={52} height={10} rx={5} />
        <circle className={s.rojo} cx={86} cy={134} r={7} />
        <path className={s.rojo} d="M82 134 h8 M86 130 v8" />
      </>
    ),
  },
  'cec-ar': {
    vb: '0 0 120 170',
    d: (
      <>
        <rect x={22} y={6} width={76} height={158} rx={10} />
        <path d="M22 26 H98" />
        <rect x={42} y={46} width={36} height={86} className={s.discontinuo} />
        <path className={s.fino} d="M34 46 V132 M31 46 h6 M31 132 h6 M42 140 H78 M42 137 v6 M78 137 v6" />
        <rect x={32} y={146} width={56} height={10} rx={5} />
      </>
    ),
  },
  'cec-catalogo': {
    vb: '0 0 120 170',
    d: (
      <>
        <rect x={22} y={6} width={76} height={158} rx={10} />
        <path d="M22 26 H98" />
        <rect x={30} y={34} width={60} height={12} rx={6} />
        <circle cx={38} cy={40} r={3} />
        {[56, 72, 88, 104, 120].map(y => (
          <path key={y} d={`M32 ${y} H72 M84 ${y - 3} l3 3 -3 3`} />
        ))}
      </>
    ),
  },
  // ——— Oh My Cat! (web) ———
  'omc-hero': {
    vb: '0 0 170 120',
    d: (
      <>
        {marco(170, 120)}
        <path d="M2 18 H168 M10 10 H34 M110 10 H124 M130 10 H144" />
        <rect className={s.rojo} x={148} y={6} width={16} height={8} rx={4} />
        <path d="M12 34 H66 M12 42 H58 M12 54 H72 M12 60 H64" />
        <rect x={12} y={70} width={30} height={9} rx={4} />
        <rect x={84} y={28} width={74} height={50} />
        <path className={s.fino} d="M84 28 L158 78 M158 28 L84 78" />
        <rect x={96} y={66} width={66} height={40} className={s.relleno} />
        <path d="M102 76 H156 M102 84 H156 M102 92 H140" />
      </>
    ),
  },
  'omc-gatos': {
    vb: '0 0 170 120',
    d: (
      <>
        {marco(170, 120)}
        <path d="M58 22 H112 M66 30 H104" />
        {[22, 67, 112].map(x => (
          <g key={x}>
            <rect x={x} y={40} width={38} height={56} rx={4} />
            <rect x={x + 4} y={44} width={30} height={24} />
            <path d={`M${x + 4} 76 H${x + 26} M${x + 4} 82 H${x + 30}`} />
            <rect x={x + 6} y={86} width={26} height={6} rx={3} />
          </g>
        ))}
        <circle cx={12} cy={68} r={6} />
        <circle className={s.rojo} cx={158} cy={68} r={6} />
      </>
    ),
  },
  'omc-calendario': {
    vb: '0 0 120 170',
    d: (
      <>
        <rect x={22} y={6} width={76} height={158} rx={10} />
        <path d="M30 22 H70" />
        {[0, 1, 2, 3, 4].map(f =>
          [0, 1, 2, 3, 4, 5, 6].map(c => (
            <circle key={`${f}-${c}`} className={s.punto} cx={32 + c * 9.3} cy={38 + f * 10} r={1.6} />
          )),
        )}
        <circle className={s.rojo} cx={69.2} cy={78} r={5} />
        {[0, 1, 2].map(f =>
          [0, 1, 2].map(c => <rect key={`h${f}-${c}`} x={30 + c * 20} y={96 + f * 12} width={17} height={8} rx={2} />),
        )}
        <rect className={s.relleno} x={50} y={96} width={17} height={8} rx={2} />
        <rect x={30} y={140} width={60} height={12} rx={6} />
      </>
    ),
  },
  'omc-codigo': {
    vb: '0 0 120 170',
    d: (
      <>
        <rect x={22} y={6} width={76} height={158} rx={10} />
        <circle cx={60} cy={44} r={14} />
        <path className={s.rojo} d="M53 44 l5 5 9 -11" />
        <rect x={38} y={68} width={44} height={12} rx={6} />
        <path d="M48 74 H72" />
        <path d="M32 94 H88 M32 104 H80 M32 114 H84" />
        <rect x={32} y={136} width={56} height={12} rx={6} />
      </>
    ),
  },
  // ——— MASSolisapp (panel web y app) ———
  'ms-panel': {
    vb: '0 0 170 120',
    d: (
      <>
        {marco(170, 120)}
        <path d="M34 2 V118 M10 14 H26 M10 26 H24 M10 34 H24 M10 42 H24 M10 54 H24" />
        <rect x={42} y={10} width={118} height={16} rx={3} className={s.relleno} />
        <path className={s.fino} d="M48 18 H96" />
        {[42, 72, 102, 132].map(x => (
          <rect key={x} x={x} y={34} width={24} height={18} rx={3} />
        ))}
        <path d="M42 62 H160 M42 72 H150 M42 82 H156 M42 92 H140" />
        <rect className={s.rojo} x={128} y={100} width={32} height={10} rx={5} />
      </>
    ),
  },
  'ms-agenda': {
    vb: '0 0 170 120',
    d: (
      <>
        {marco(170, 120)}
        <path d="M2 18 H168 M30 18 V118 M64 18 V118 M98 18 V118 M132 18 V118" />
        <path className={s.fino} d="M8 32 H24 M8 52 H24 M8 72 H24 M8 92 H24" />
        <rect x={34} y={30} width={26} height={22} rx={3} />
        <rect x={102} y={58} width={26} height={30} rx={3} />
        <rect x={68} y={44} width={26} height={22} rx={3} className={s.discontinuo} />
        <path className={s.rojo} d="M60 41 C66 41 68 50 72 54 M68 50 l4 4 l1 -6" />
      </>
    ),
  },
  'ms-tareas': {
    vb: '0 0 120 170',
    d: (
      <>
        <rect x={22} y={6} width={76} height={158} rx={10} />
        <path d="M36 22 H84" />
        <rect x={32} y={32} width={56} height={6} rx={3} className={s.relleno} />
        {[52, 68, 84, 100, 116].map((y, i) => (
          <g key={y}>
            <rect x={32} y={y - 5} width={8} height={8} rx={1.5} />
            {i < 3 && <path className={s.rojo} d={`M33.5 ${y - 1} l2.5 2.5 4 -5`} />}
            <path d={`M46 ${y - 1} H${80 - i * 4}`} />
          </g>
        ))}
        <rect x={32} y={140} width={56} height={12} rx={6} />
      </>
    ),
  },
  'ms-fotos': {
    vb: '0 0 120 170',
    d: (
      <>
        <rect x={22} y={6} width={76} height={158} rx={10} />
        <path d="M36 22 H84 M32 36 H58" />
        <rect x={32} y={42} width={26} height={26} rx={3} />
        <rect x={62} y={42} width={26} height={26} rx={3} />
        <path className={s.fino} d="M32 68 L45 52 L58 68 M62 68 L75 52 L88 68" />
        <path d="M32 82 H64" />
        <rect x={32} y={88} width={56} height={30} rx={4} className={s.discontinuo} />
        <circle className={s.rojo} cx={60} cy={103} r={6} />
        <path className={s.rojo} d="M57 103 h6 M60 100 v6" />
        <rect x={32} y={140} width={56} height={12} rx={6} />
      </>
    ),
  },
  // ——— Path 6 (app móvil y web) ———
  'p6-camino': {
    vb: '0 0 120 170',
    d: (
      <>
        <rect x={22} y={6} width={76} height={158} rx={10} />
        <path d="M36 22 H84" />
        <path className={s.discontinuo} d="M42 46 C80 52 82 70 76 76 C56 88 40 92 44 106 C48 120 80 118 78 136" />
        <circle cx={42} cy={46} r={7} className={s.relleno} />
        <circle className={s.rojo} cx={76} cy={76} r={8} />
        <circle cx={44} cy={106} r={6} />
        <path className={s.fino} d="M41 106 h6 M44 103 v6" />
        <circle cx={78} cy={136} r={6} />
        <path className={s.fino} d="M52 44 H66 M54 76 H66 M54 104 H68" />
      </>
    ),
  },
  'p6-precio': {
    vb: '0 0 170 120',
    d: (
      <>
        {marco(170, 120)}
        <path d="M14 20 H70" />
        <path className={s.relleno} d="M14 32 H54 V44 H14 Z" />
        <path d="M14 66 H156" />
        <path className={s.rojo} d="M58 66 H104" />
        <circle className={s.rojo} cx={80} cy={66} r={6} />
        <path className={s.fino} d="M58 58 V74 M104 58 V74" />
        <path className={s.fino} d="M14 88 H120 M14 98 H100 M14 108 H110" />
      </>
    ),
  },
  'p6-visor': {
    vb: '0 0 120 170',
    d: (
      <>
        <rect x={18} y={8} width={84} height={150} rx={4} />
        <path d="M28 26 H70" />
        <path className={s.fino} d="M28 42 H92 M28 52 H60 M28 62 H92 M28 82 H90 M28 92 H70 M28 112 H92 M28 122 H80" />
        <path className={s.rojo} d="M62 50 L84 54 M28 72 H56" />
        <path className={s.rojo} d="M74 90 C80 84 88 86 90 92" />
        <circle className={s.rojo} cx={94} cy={62} r={4} />
        <rect x={28} y={136} width={64} height={12} rx={6} />
      </>
    ),
  },
  'p6-perfiles': {
    vb: '0 0 120 170',
    d: (
      <>
        <rect x={22} y={6} width={76} height={158} rx={10} />
        <path d="M34 22 H76" />
        {[40, 70, 100, 130].map((y, i) => (
          <g key={y}>
            <rect x={30} y={y - 10} width={60} height={24} rx={5} className={i === 0 ? s.rojo : undefined} />
            <circle cx={40} cy={y + 2} r={5} />
            <path className={s.fino} d={`M50 ${y - 1} H${80 - i * 3} M50 ${y + 6} H70`} />
          </g>
        ))}
      </>
    ),
  },
}

/** Dónde va cada papel: arriba (en % de la página), lado, giro y ancho. */
const sitios: { top: string; lado: 'izq' | 'der'; giro: number }[] = [
  { top: '9%', lado: 'der', giro: 7 },
  { top: '27%', lado: 'izq', giro: -8 },
  { top: '47%', lado: 'der', giro: -5 },
  { top: '68%', lado: 'izq', giro: 6 },
]

type Garabato = { dibujo: string; nota: string; top?: string; lado?: 'izq' | 'der' }

export function Garabatos({ items }: { items: Garabato[] }) {
  return (
    <div className={s.garabatos} aria-hidden="true">
      {items.map((it, i) => {
        const dib = dibujos[it.dibujo]
        // Un caso puede fijar su propio sitio para no tapar diagramas anchos
        const sitio = { ...sitios[i % sitios.length], ...(it.top && { top: it.top }), ...(it.lado && { lado: it.lado }) }
        if (!dib) return null
        const ancho = dib.vb.endsWith('120') ? 210 : 160
        return (
          <div
            key={it.dibujo}
            className={`${s.papel} ${s[sitio.lado]}`}
            style={{ top: sitio.top, width: ancho, rotate: `${sitio.giro}deg` } as CSSProperties}
          >
            <svg className={s.tinta} viewBox={dib.vb}>
              {dib.d}
            </svg>
            <p className={s.nota}>{it.nota}</p>
          </div>
        )
      })}
    </div>
  )
}
