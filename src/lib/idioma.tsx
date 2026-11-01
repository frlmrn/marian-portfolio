import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { usarIdioma, type Idioma } from '../content'

const CLAVE = 'idioma'

function guardado(): Idioma {
  try {
    return localStorage.getItem(CLAVE) === 'en' ? 'en' : 'es'
  } catch {
    return 'es'
  }
}

// El idioma se fija antes del primer pintado, para que no parpadee
const inicial = guardado()
usarIdioma(inicial)

const IdiomaContext = createContext<{
  idioma: Idioma
  cambiar: (i: Idioma) => void
}>({
  idioma: inicial,
  cambiar: () => {},
})

/** Idioma de la web (castellano por defecto); se recuerda en este navegador. */
export function IdiomaProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdioma] = useState<Idioma>(inicial)

  const cambiar = (i: Idioma) => {
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

  return <IdiomaContext.Provider value={{ idioma, cambiar }}>{children}</IdiomaContext.Provider>
}

export const useIdioma = () => useContext(IdiomaContext)
