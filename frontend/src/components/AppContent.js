/**
 * AppContent Component
 *
 * Main content area that renders routes defined in routes.js.
 * Handles lazy loading with Suspense and provides a loading spinner
 * while components are being loaded.
 *
 * Features:
 * - Dynamic route rendering from routes configuration
 * - Suspense boundary for lazy-loaded components
 * - Automatic redirect from root to dashboard
 * - Loading spinner fallback during component load
 *
 * @component
 * @example
 * return (
 *   <AppContent />
 * )
 */

import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

import ProteccionRol from './proteccionRol'
import { obtenerRutaPrincipal } from '../views/utils/usuario'

// routes config
import routes from '../routes'

/**
 * AppContent functional component
 *
 * Renders all application routes within a container with:
 * - Suspense for lazy-loaded route components
 * - Spinner shown during component loading
 * - Default redirect to dashboard
 *
 * Memoized to prevent unnecessary re-renders when parent updates.
 *
 * @returns {React.ReactElement} Content container with routed views
 */
const AppContent = () => {
  return (
    <CContainer className="px-4 app-main-content" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route) => {
            const Element = route.element
            const contenido = route.roles ? (
              <ProteccionRol rolesPermitidos={route.roles}>
                <Element />
              </ProteccionRol>
            ) : (
              <Element />
            )

            return (
              route.element && (
                <Route
                  key={route.path}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={contenido}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to={obtenerRutaPrincipal() || '/login'} replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
