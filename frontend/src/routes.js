/**
 * Application Routes Configuration
 *
 * Defines all protected routes in the application using React lazy loading
 * for code splitting and performance optimization.
 *
 * Each route object contains:
 * - path: URL path for the route
 * - name: Human-readable name for breadcrumbs
 * - element: Lazy-loaded React component
 * - exact: (optional) Requires exact path match
 *
 * @module routes
 */

import React from 'react'

// Dashboard
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Academic modules
const PadresTutores = React.lazy(() => import('./views/padreTutor/PadreTutor'))
const Estudiantes = React.lazy(() => import('./views/estudiantes/Estudiantes'))
const Cursos = React.lazy(() => import('./views/cursos/Cursos'))
const Profesores = React.lazy(() => import('./views/profesores/Profesores'))
const Inscripciones = React.lazy(() => import('./views/inscripciones/Inscripciones'))
const PreinscripcionEstudiante = React.lazy(
  () => import('./views/preinscripciones/PreinscripcionEstudiante'),
)
const ControlPagosEstudiante = React.lazy(
  () => import('./views/gestionAdministrador/controlPagosEstudiantes/ControlPagosEstudiante'),
)
const Recibos = React.lazy(() => import('./views/gestionAdministrador/recibos/Recibos'))

const MostrarCursosProfesor = React.lazy(
  () => import('./views/gestionProfesor/mostrarCursosProfesor/mostrarCursosProfesor'),
)
const MostrarEstudiantesProfesor = React.lazy(
  () => import('./views/gestionProfesor/mostrarEstudiantesProfesor/mostrarEstudianteProfesor'),
)
const CursosEvaluacionProfesor = React.lazy(
  () => import('./views/gestionProfesor/obtenerCursosEvaluacion/obtenerCursosEvaluacionProfesor'),
)
const PreinscripcionCursosEstudiante = React.lazy(
  () =>
    import('./views/gestionEstudiante/preinscripcionACursosEstudiantes/preinscripcionACursosEstudiantes'),
)
const CursosResultadosEstudiante = React.lazy(
  () =>
    import('./views/gestionEstudiante/mostrarCursosEstudiante/mostrarCursosResultadosExamenEstudiante'),
)

/**
 * Array of route configuration objects
 *
 * @type {Array<Object>}
 * @property {string} path - URL path pattern
 * @property {string} name - Display name for breadcrumbs and navigation
 * @property {React.LazyExoticComponent} element - Lazy-loaded component
 * @property {boolean} [exact] - Whether to match path exactly
 *
 * @example
 * // Route renders when URL matches '/dashboard'
 * { path: '/dashboard', name: 'Dashboard', element: Dashboard }
 *
 * @example
 * // Route with exact match required
 * { path: '/base', name: 'Base', element: Cards, exact: true }
 */
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  {
    path: '/admin/recibos',
    name: 'Registro de Recibos',
    element: Recibos,
    roles: ['administrador'],
  },
  {
    path: '/admin/padres-tutores',
    name: 'Padres y Tutores',
    element: PadresTutores,
    roles: ['administrador'],
  },
  {
    path: '/admin/estudiantes',
    name: 'Estudiantes',
    element: Estudiantes,
    roles: ['administrador'],
  },
  { path: '/admin/cursos', name: 'Cursos', element: Cursos, roles: ['administrador'] },
  { path: '/admin/profesores', name: 'Profesores', element: Profesores, roles: ['administrador'] },
  {
    path: '/admin/inscripciones',
    name: 'Inscripciones',
    element: Inscripciones,
    roles: ['administrador'],
  },
  {
    path: '/admin/preinscripciones',
    name: 'Preinscripciones',
    element: PreinscripcionEstudiante,
    roles: ['administrador'],
  },
  {
    path: '/admin/control-pagos',
    name: 'Control de pagos',
    element: ControlPagosEstudiante,
    roles: ['administrador'],
  },
  {
    path: '/docente/cursos',
    name: 'Mis cursos',
    element: MostrarCursosProfesor,
    roles: ['profesor'],
  },
  {
    path: '/docente/estudiantes',
    name: 'Mis estudiantes',
    element: MostrarEstudiantesProfesor,
    roles: ['profesor'],
  },
  {
    path: '/docente/evaluaciones',
    name: 'Evaluaciones',
    element: CursosEvaluacionProfesor,
    roles: ['profesor'],
  },
  {
    path: '/estudiante/preinscripciones',
    name: 'Inscribirme a cursos',
    element: PreinscripcionCursosEstudiante,
    roles: ['estudiante'],
  },
  {
    path: '/estudiante/cursos',
    name: 'Mis cursos y resultados',
    element: CursosResultadosEstudiante,
    roles: ['estudiante'],
  },
]

export default routes
