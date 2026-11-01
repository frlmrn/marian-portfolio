import { lazy, Suspense, useEffect } from 'react'
import { matchCase, matchExpediente, useRouter } from './lib/router'
import { useViewport } from './lib/layout'
import { useIdioma } from './lib/idioma'
import { cards, expedientes, ui } from './content'
import { Home } from './views/Home'
import { HomeMobile } from './views/HomeMobile'

// Las secciones interiores se descargan al abrirlas: la portada carga antes
const About = lazy(() => import('./views/About').then(m => ({ default: m.About })))
const AboutStage = lazy(() => import('./views/AboutStage').then(m => ({ default: m.AboutStage })))
const Cases = lazy(() => import('./views/Cases').then(m => ({ default: m.Cases })))
const CasesStage = lazy(() => import('./views/CasesStage').then(m => ({ default: m.CasesStage })))
const Contact = lazy(() => import('./views/Contact').then(m => ({ default: m.Contact })))
const ContactStage = lazy(() => import('./views/ContactStage').then(m => ({ default: m.ContactStage })))
const Expediente = lazy(() => import('./views/Expediente').then(m => ({ default: m.Expediente })))
const NoEncontrado = lazy(() => import('./views/NoEncontrado').then(m => ({ default: m.NoEncontrado })))

/** Dirección pública de la web (para la URL canónica de cada página) */
const SITIO = 'https://marian-portfolio-mu.vercel.app'

/** ¿La dirección corresponde a una página que existe? */
function existe(path: string) {
  const limpio = path.replace(/\/+$/, '') || '/'
  if (['/', '/sobre-mi', '/casos', '/contacto'].includes(limpio)) return true
  const exp = matchExpediente(limpio)
  if (exp) return exp in expedientes
  const caso = matchCase(limpio)
  return !!caso && caso in cards && caso !== 'sobre-mi'
}

export function App() {
  const { page, path } = useRouter()
  const vp = useViewport()
  // al cambiar de idioma se vuelve a pintar toda la web con los textos nuevos
  const { idioma } = useIdioma()
  const valida = existe(path)

  // Título y descripción de cada página (buscadores y enlaces compartidos)
  useEffect(() => {
    const exp = matchExpediente(path)
    const card = exp ? cards[exp as keyof typeof cards] : undefined
    document.title = !valida ? ui.noEncontrado.titulo : card ? ui.tituloExpediente(card.nombre) : ui.titulos[page]
    const desc = exp && expedientes[exp] ? expedientes[exp].lead : ui.descripciones[page]
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', desc)
    const url = SITIO + (path.replace(/\/+$/, '') || '/')
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', url)
    // La 404 no debe aparecer en buscadores
    document.querySelector('meta[name="robots"]')?.remove()
    if (!valida) {
      const robots = document.createElement('meta')
      robots.name = 'robots'
      robots.content = 'noindex'
      document.head.append(robots)
    }
  }, [page, path, idioma, valida])

  return <Suspense fallback={<div className="papel" style={{ minHeight: '100vh' }} />}>{vista()}</Suspense>

  function vista() {
    if (!valida) return <NoEncontrado />
    if (page === 'sobre-mi') return vp.desktop ? <AboutStage unit={vp.u} /> : <About />
    // El expediente completo es una página larga en columna en todos los tamaños
    const expediente = matchExpediente(path)
    if (page === 'casos' && expediente) return <Expediente id={expediente} />
    if (page === 'casos') return vp.desktop ? <CasesStage unit={vp.u} /> : <Cases />
    if (page === 'contacto') return vp.desktop ? <ContactStage unit={vp.u} /> : <Contact />
    return vp.desktop ? <Home unit={vp.u} /> : <HomeMobile />
  }
}
