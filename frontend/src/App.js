/**
 * App Component
 *
 * Root application component that sets up routing, theme management,
 * and lazy-loaded page components with suspense boundaries.
 *
 * Features:
 * - Client-side routing with HashRouter
 * - Theme detection from URL parameters and Redux state
 * - Lazy loading for all routes with loading spinner fallback
 * - Public routes (login, register, error pages)
 * - Protected routes wrapped in DefaultLayout
 *
 * @module App
 */

import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import ProteccionRoute from './components/ProteccionRoute'
import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Home = React.lazy(() => import('./views/pages/home/Home'))
const VerificarRecibo = React.lazy(() => import('./views/pages/verificarRecibo/VerificarRecibo'))

/**
 * Main Application Component
 *
 * Manages application-wide concerns:
 * - Theme initialization and persistence
 * - Client-side routing configuration
 * - Lazy loading with suspense fallbacks
 * - Theme detection from URL query parameters
 *
 * Theme priority:
 * 1. URL parameter (?theme=dark)
 * 2. Redux stored theme
 * 3. Browser/system preference (auto)
 *
 * @component
 * @returns {React.ReactElement} Application root with routing
 *
 * @example
 * // Standard usage in index.js
 * import App from './App'
 * ReactDOM.render(<App />, document.getElementById('root'))
 */
const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const normalizarRutaHash = () => {
      const { pathname, hash } = window.location

      if (pathname === '/' && (hash === '#login' || hash === '#register' || hash === '#')) {
        const ruta = hash === '#login' ? '#/login' : hash === '#register' ? '#/register' : '#/'
        window.history.replaceState(null, '', `/#/${ruta.replace(/^#\//, '')}`)
        return
      }

      if (pathname !== '/' && !hash) {
        const rutaSinBarra = pathname.replace(/^\/+|\/+$/g, '')
        if (rutaSinBarra) {
          window.location.replace(`/#/${rutaSinBarra}`)
        }
      }

      if (hash === '#login' || hash === '#register' || hash === '#') {
        const ruta = hash === '#login' ? '#/login' : hash === '#register' ? '#/register' : '#/'
        window.history.replaceState(null, '', ruta)
      }
    }

    normalizarRutaHash()
    window.addEventListener('hashchange', normalizarRutaHash)

    return () => {
      window.removeEventListener('hashchange', normalizarRutaHash)
    }
  }, [])

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/" name="Home" element={<Home />} />
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route
            exact
            path="/verificar-recibo/:token"
            name="Verificar recibo"
            element={<VerificarRecibo />}
          />
          <Route
            path="*"
            name="Home"
            element={
              <ProteccionRoute>
                <DefaultLayout />
              </ProteccionRoute>
            }
          />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
