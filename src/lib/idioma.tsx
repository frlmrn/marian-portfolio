import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { usarIdioma, type Idioma } from '../content'
import { enIngles, modoArchivo, rutaActual, urlDe } from './router'

const CLAVE = 'idioma'

function guardado(): Idioma {
  try {
    return localStorage.getItem(CLAVE) === 'en' ? 'en' : 'es'
  } catch {
    return 'es'
  }
}

/** Manda la dirección; sin servidor (doble clic) no hay /en y vale lo guardado. */
const deLaUrl = (): Idioma => (enIngles() ? 'en' : 'es')

// Quien eligió inglés vuelve a su versión al entrar por la portada
if (!modoArchivo && location.pathname === '/' && guardado() === 'en') history.replaceState(null, '', '/en')

// El idioma se fija antes del primer pintado, para que no parpadee
const inicial = modoArchivo ? guardado() : deLaUrl()
usarIdioma(inicial)

const IdiomaContext = createContext<{
  idioma: Idioma
  cambiar: (i: Idioma) => void
}>({
  idioma: inicial,
  cambiar: () => {},
})

/** Idioma de la web: cada uno tiene sus direcciones, y se recuerda en este navegador. */
export function IdiomaProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdioma] = useState<Idioma>(inicial)

  const cambiar = (i: Idioma) => {
    if (!modoArchivo) history.replaceState(null, '', urlDe(rutaActual(), i === 'en'))
    usarIdioma(i)
    try {
      localStorage.setItem(CLAVE, i)
    } catch {
      // sin almacenamiento (modo privado): el cambio vale solo para esta visita
    }
    setIdioma(i)
  }

  useEffect(() => {
    document.documentElement.lang = idioma
  }, [idioma])

  // Atrás y adelante también pueden cruzar de un idioma a otro
  useEffect(() => {
    if (modoArchivo) return
    const onPop = () => {
      usarIdioma(deLaUrl())
      setIdioma(deLaUrl())
    }
    addEventListener('popstate', onPop)
    return () => removeEventListener('popstate', onPop)
  }, [])

  return <IdiomaContext.Provider value={{ idioma, cambiar }}>{children}</IdiomaContext.Provider>
}

export const useIdioma = () => useContext(IdiomaContext)
