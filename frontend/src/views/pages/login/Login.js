import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { postLogin } from '../../../services/autorizacionRoutes'
import { setAccessToken, clearAccessToken } from '../../../services/authSession'
import { obtenerRutaPrincipal } from '../../utils/usuario'

const Login = () => {
  const navigate = useNavigate()
  const [formulario, setFormulario] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleChange = (event) => {
    setFormulario({ ...formulario, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setCargando(true)

    try {
      const respuesta = await postLogin(formulario)
      setAccessToken(respuesta.data.token)

      const rutaPrincipal = obtenerRutaPrincipal()
      if (!rutaPrincipal) {
        clearAccessToken()
        setError('El rol del usuario no tiene una ruta asignada')
        return
      }

      navigate(rutaPrincipal, { replace: true })
    } catch (loginError) {
      setError(loginError.response?.data?.message || 'No fue posible iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Iniciar sesión</h1>
                    <p className="text-body-secondary">Ingresa a tu cuenta de la academia</p>
                    {error && <CAlert color="danger">{error}</CAlert>}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        name="email"
                        value={formulario.email}
                        onChange={handleChange}
                        placeholder="Correo electrónico"
                        autoComplete="email"
                        disabled={cargando}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        name="password"
                        value={formulario.password}
                        onChange={handleChange}
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        disabled={cargando}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit" disabled={cargando}>
                          {cargando ? 'Ingresando...' : 'Iniciar sesión'}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          ¿Olvidaste tu contraseña?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Forma parte de nuestra academia</h2>
                    <p>
                      Da el siguiente paso en tu formación con acompañamiento docente, cursos
                      especializados y un espacio pensado para alcanzar tus metas.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Preinscribirme ahora
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
