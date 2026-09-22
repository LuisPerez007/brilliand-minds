import CIcon from '@coreui/icons-react'
import {
  cilBook,
  cilCash,
  cilEducation,
  cilPeople,
  cilSchool,
  cilSpeedometer,
  cilTask,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Administracion',
    roles: ['administrador'],
  },
  {
    component: CNavItem,
    name: 'Registro de Pagos',
    to: '/admin/recibos',
    icon: <CIcon icon={cilCash} customClassName="nav-icon" />,
    roles: ['administrador'],
  },
  {
    component: CNavItem,
    name: 'Padres y Tutores',
    to: '/admin/padres-tutores',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    roles: ['administrador'],
  },
  {
    component: CNavItem,
    name: 'Estudiantes',
    to: '/admin/estudiantes',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    roles: ['administrador'],
  },
  {
    component: CNavItem,
    name: 'Cursos',
    to: '/admin/cursos',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    roles: ['administrador'],
  },
  {
    component: CNavItem,
    name: 'Profesores',
    to: '/admin/profesores',
    icon: <CIcon icon={cilEducation} customClassName="nav-icon" />,
    roles: ['administrador'],
  },
  {
    component: CNavItem,
    name: 'Consultas de inscripciones',
    to: '/admin/inscripciones',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
    roles: ['administrador'],
  },
  {
    component: CNavItem,
    name: 'Preinscripciones',
    to: '/admin/preinscripciones',
    icon: <CIcon icon={cilSchool} customClassName="nav-icon" />,
    roles: ['administrador'],
  },
  {
    component: CNavItem,
    name: 'Control de pagos',
    to: '/admin/control-pagos',
    icon: <CIcon icon={cilCash} customClassName="nav-icon" />,
    roles: ['administrador'],
  },
  {
    component: CNavTitle,
    name: 'Gestion docente',
    roles: ['profesor'],
  },
  {
    component: CNavItem,
    name: 'Mis cursos',
    to: '/docente/cursos',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    roles: ['profesor'],
  },
  {
    component: CNavItem,
    name: 'Mis estudiantes',
    to: '/docente/estudiantes',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    roles: ['profesor'],
  },
  {
    component: CNavItem,
    name: 'Evaluaciones',
    to: '/docente/evaluaciones',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
    roles: ['profesor'],
  },
  {
    component: CNavTitle,
    name: 'Gestion estudiante',
    roles: ['estudiante'],
  },
  {
    component: CNavItem,
    name: 'Inscribirme a cursos',
    to: '/estudiante/preinscripciones',
    icon: <CIcon icon={cilSchool} customClassName="nav-icon" />,
    roles: ['estudiante'],
  },
  {
    component: CNavItem,
    name: 'Mis cursos y resultados',
    to: '/estudiante/cursos',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    roles: ['estudiante'],
  },
]

export default _nav
