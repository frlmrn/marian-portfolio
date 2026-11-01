import { useEffect, useState, type CSSProperties } from 'react'

/**
 * La portada de escritorio se dibuja en las coordenadas de la imagen original
 * (1536 × 1024 «unidades»). Una unidad mide `--u` píxeles: lo que permita el
 * alto de la ventana, sin bajar de 1490 unidades de ancho (por debajo, los
 * bloques laterales se echan encima del titular). Los bordes izquierdo y derecho se anclan a los
 * lados de la ventana, así que en pantallas anchas la composición respira.
 */
export const STAGE_W = 1536
export const STAGE_H = 1024
const MIN_VISIBLE_W = 1490

/** Por debajo de esta proporción (o de 900 px de ancho) se usa la versión vertical. */
const DESKTOP_MIN_RATIO = 1.45
const DESKTOP_MIN_WIDTH = 900

export function unitFor(width: number, height: number) {
  return Math.min(height / STAGE_H, width / MIN_VISIBLE_W)
}

function isDesktop(width: number, height: number) {
  return width >= DESKTOP_MIN_WIDTH && width / height >= DESKTOP_MIN_RATIO
}

export function useViewport() {
  const read = () => ({ w: innerWidth, h: innerHeight })
  const [vp, setVp] = useState(read)
  useEffect(() => {
    const onResize = () => setVp(read())
    addEventListener('resize', onResize)
    return () => removeEventListener('resize', onResize)
  }, [])
  return { ...vp, u: unitFor(vp.w, vp.h), desktop: isDesktop(vp.w, vp.h) }
}

/** Caja absoluta en unidades de la imagen. */
export function box(x: number, y: number, w?: number, h?: number): CSSProperties {
  return {
    left: `calc(var(--u) * ${x})`,
    top: `calc(var(--u) * ${y})`,
    ...(w !== undefined && { width: `calc(var(--u) * ${w})` }),
    ...(h !== undefined && { height: `calc(var(--u) * ${h})` }),
  }
}

/** Longitud en unidades de la imagen (para tamaños de letra, bordes…). */
export const u = (n: number) => `calc(var(--u) * ${n})`
