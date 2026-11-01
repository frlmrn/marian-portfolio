/**
 * Coloca una tarjeta girada sobre su chincheta. Se da el centro que debe
 * tener ya girada (medido en la imagen), su tamaño, el giro y dónde está la
 * chincheta (en % de la tarjeta). Devuelve la caja sin girar, de modo que al
 * girar alrededor de la chincheta el centro cae donde toca.
 */
export function pinnedRect(o: { cx: number; cy: number; w: number; h: number; rot: number; px: number; py: number }) {
  const t = (o.rot * Math.PI) / 180
  const vx = o.w / 2 - (o.px / 100) * o.w
  const vy = o.h / 2 - (o.py / 100) * o.h
  const rx = vx * Math.cos(t) - vy * Math.sin(t)
  const ry = vx * Math.sin(t) + vy * Math.cos(t)
  const pivotX = o.cx - rx
  const pivotY = o.cy - ry
  return {
    x: pivotX - (o.px / 100) * o.w,
    y: pivotY - (o.py / 100) * o.h,
    w: o.w,
    h: o.h,
    rot: o.rot,
    pivot: { x: o.px, y: o.py },
  }
}
