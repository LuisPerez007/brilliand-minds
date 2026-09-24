/**
 * AppHeader Component
 *
 * Main application header with navigation, theme switcher, and user menu.
 * Features include:
 * - Sidebar toggle button
 * - Primary navigation links
 * - Notification and action icons
 * - Theme switcher (light/dark/auto)
 * - User dropdown menu
 * - Breadcrumb navigation
 * - Sticky positioning with scroll shadow effect
 *
 * @component
 * @example
 * return (
 *   <AppHeader />
 * )
 */

import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CBadge,
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilContrast, cilDescription, cilMenu, cilMoon, cilSun } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { getPreinscripcionEstudiante } from '../services/preInscripcionEstudianteRoutes'
import { obtenerRol } from '../views/utils/usuario'

/**
 * AppHeader functional component
 *
 * Manages header UI including:
 * - Redux integration for sidebar state
 * - Theme management with CoreUI useColorModes hook
 * - Scroll-based shadow effect
 * - Responsive navigation
 *
 * @returns {React.ReactElement} Header component with navigation and controls
 */
const AppHeader = () => {
  const headerRef = useRef()
  const navigate = useNavigate()
  const [preinscripcionesPendientes, setPreinscripcionesPendientes] = useState(0)
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const rol = obtenerRol()

  useEffect(() => {
    const handleScroll = () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    }

    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (rol !== 'administrador') {
      return undefined
    }

    let componenteActivo = true

    getPreinscripcionEstudiante()
      .then((respuesta) => {
        if (componenteActivo) {
          setPreinscripcionesPendientes(respuesta.data.length)
        }
      })
      .catch((error) => {
        console.error('Error al obtener el contador de preinscripciones', error)
      })

    return () => {
      componenteActivo = false
    }
  }, [rol])

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
          className="header-link"
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        {rol === 'estudiante' && (
          <CHeaderNav className="d-none d-md-flex header-nav">
            <CNavItem>
              <CNavLink to="/estudiante/preinscripciones" as={NavLink} className="header-link">
                Inscribirme a cursos
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/estudiante/cursos" as={NavLink} className="header-link">
                Mis cursos y resultados
              </CNavLink>
            </CNavItem>
          </CHeaderNav>
        )}
        {rol === 'profesor' && (
          <CHeaderNav className="d-none d-md-flex header-nav">
            <CNavItem>
              <CNavLink to="/docente/cursos" as={NavLink} className="header-link">
                Mis Cursos
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/docente/estudiantes" as={NavLink} className="header-link">
                Mis Estudiantes
              </CNavLink>
            </CNavItem>
          </CHeaderNav>
        )}
        {rol === 'administrador' && (
          <CHeaderNav className="d-none d-md-flex header-nav">
            <CNavItem>
              <CNavLink to="/admin/estudiantes" as={NavLink} className="header-link">
                Estudiantes
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/admin/cursos" as={NavLink} className="header-link">
                Cursos
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink to="/admin/profesores" as={NavLink} className="header-link">
                Profesores
              </CNavLink>
            </CNavItem>
          </CHeaderNav>
        )}
        <CHeaderNav className="ms-auto align-items-center">
          {rol === 'administrador' && (
            <CNavItem>
              <CNavLink
                as="button"
                type="button"
                onClick={() => navigate('/admin/preinscripciones')}
                title="Ver preinscripciones"
                className="header-preinscripciones"
              >
                <CIcon icon={cilDescription} size="lg" />
                <CBadge color="danger" shape="rounded-pill" className="header-badge">
                  {preinscripcionesPendientes}
                </CBadge>
              </CNavLink>
            </CNavItem>
          )}
        </CHeaderNav>
        <CHeaderNav className="align-items-center">
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
