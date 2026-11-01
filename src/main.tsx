import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/bricolage-grotesque/opsz.css'
import '@fontsource/ibarra-real-nova/500-italic.css'
import '@fontsource/ibarra-real-nova/600-italic.css'
import './styles/base.css'
import { RouterProvider } from './lib/router'
import { IdiomaProvider } from './lib/idioma'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IdiomaProvider>
      <RouterProvider>
        <App />
      </RouterProvider>
    </IdiomaProvider>
  </StrictMode>,
)
