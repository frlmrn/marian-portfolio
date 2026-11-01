import { es, type Textos } from './textos/es'
import { en } from './textos/en'

export type { CardItem, Caso } from './textos/es'

/*
 * Textos de la web en el idioma elegido (castellano o inglés). Cada export
 * apunta siempre al idioma actual, así que los componentes siguen leyendo
 * `pistas.chai` o `cards.cecotec` como siempre; al cambiar de idioma la App
 * se vuelve a pintar entera (ver lib/idioma.tsx).
 *
 * Ojo: leer los textos siempre al pintar, nunca guardarlos en una constante
 * fuera de un componente, o se quedarían en el idioma del arranque.
 */
export type Idioma = 'es' | 'en'
const textos: Record<Idioma, Textos> = { es, en }
let actual: Textos = es

export function usarIdioma(idioma: Idioma) {
  actual = textos[idioma]
}

function vivo<K extends keyof Textos>(k: K): Textos[K] {
  const de = () => actual[k] as object
  return new Proxy(de(), {
    get: (_t, p) => Reflect.get(de(), p),
    has: (_t, p) => Reflect.has(de(), p),
    ownKeys: () => Reflect.ownKeys(de()),
    getOwnPropertyDescriptor: (_t, p) => Reflect.getOwnPropertyDescriptor(de(), p),
  }) as Textos[K]
}

export const home = vivo('home')
export const pistas = vivo('pistas')
export const cards = vivo('cards')
export const pages = vivo('pages')
export const sobreMi = vivo('sobreMi')
export const casos = vivo('casos')
export const contacto = vivo('contacto')
export const ui = vivo('ui')
export const expedientes = vivo('expedientes')
