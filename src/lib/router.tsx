import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'

/** Router mínimo sobre la History API: cuatro pestañas (y un caso por URL), sin dependencias. */

/** Abierta con doble clic (file://) no hay servidor: las rutas van detrás de #. */
export const modoArchivo = location.protocol === 'file:'
const rutaActual = () => (modoArchivo ? location.hash.slice(1) || '/' : location.pathname)

/** Dirección de un prototipo: sin servidor, se abre desde la carpeta public. */
export const urlPrototipo = (url: string) => (modoArchivo ? `public${url}` : url)

export type PageName = 'inicio' | 'sobre-mi' | 'casos' | 'contacto'

export const paths: Record<PageName, string> = {
  inicio: '/',
  'sobre-mi': '/sobre-mi',
  casos: '/casos',
  contacto: '/contacto',
}

export function matchPage(pathname: string): PageName {
  const clean = pathname.replace(/\/+$/, '') || '/'
  if (clean.startsWith(paths.casos + '/')) return 'casos'
  const found = (Object.keys(paths) as PageName[]).find(name => paths[name] === clean)
  return found ?? 'inicio'
}

/** Expediente completo de un caso: /casos/<id>/expediente. */
export const expedienteHref = (id: string) => `${paths.casos}/${id}/expediente`

export function matchExpediente(pathname: string): string | undefined {
  return pathname.replace(/\/+$/, '').match(/^\/casos\/([\w-]+)\/expediente$/)?.[1]
}

/** Caso abierto en /casos/<id>, si lo hay. */
export function matchCase(pathname: string): string | undefined {
  return pathname.replace(/\/+$/, '').match(/^\/casos\/([\w-]+)$/)?.[1]
}

type RouterValue = { page: PageName; path: string; navigate: (to: string, opts?: { scroll?: boolean }) => void }
const RouterContext = createContext<RouterValue | null>(null)

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(rutaActual)
  const page = matchPage(path)

  useEffect(() => {
    const onPop = () => setPath(rutaActual())
    addEventListener('popstate', onPop)
    addEventListener('hashchange', onPop)
    return () => {
      removeEventListener('popstate', onPop)
      removeEventListener('hashchange', onPop)
    }
  }, [])

  const navigate = useCallback((to: string, opts?: { scroll?: boolean }) => {
    if (modoArchivo) location.hash = to
    else if (to !== location.pathname) history.pushState(null, '', to)
    if (opts?.scroll !== false) scrollTo(0, 0)
    setPath(to)
  }, [])

  return <RouterContext.Provider value={{ page, path, navigate }}>{children}</RouterContext.Provider>
}

export function useRouter() {
  const value = useContext(RouterContext)
  if (!value) throw new Error('useRouter fuera de <RouterProvider>')
  return value
}

/** Enlace interno: navega sin recargar y deja funcionar ctrl/cmd + clic. */
export function Link({
  to,
  onClick,
  keepScroll = false,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; keepScroll?: boolean }) {
  const { navigate } = useRouter()
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to, { scroll: !keepScroll })
  }
  // oxlint-disable-next-line jsx-a11y/anchor-has-content -- el contenido llega en rest.children
  return <a href={modoArchivo ? `#${to}` : to} onClick={handle} {...rest} />
}
