import type { RefObject } from 'react'
import type { PolaroidHandle } from '../components/Polaroid'

/**
 * «Explora las tarjetas»: las polaroids son la navegación principal, así que
 * el botón no lleva a otra página. Las balancea una tras otra para señalarlas
 * y deja el foco del teclado en la primera.
 */
export function exploreCards(cards: RefObject<PolaroidHandle | null>[], gap = 170) {
  cards[0]?.current?.focus()
  cards.forEach((c, i) => window.setTimeout(() => c.current?.sway(), i * gap))
}
