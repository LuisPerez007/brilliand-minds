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
    <div className="login-page" data-coreui-theme="light">
      <CContainer className="login-container">
        <CRow className="justify-content-center">
          <CCol md={10} lg={9}>
            <CCardGroup className="login-card-group">
              <CCard className="login-card login-card--form">
                <CCardBody className="login-card__body">
                  <CForm onSubmit={handleSubmit}>
                    <div className="login-header">
                      <span className="login-header__eyebrow">Plataforma académica</span>
                      <h1>Iniciar sesión</h1>
                      <p className="login-subtitle">Ingresa a tu cuenta de la academia</p>
                    </div>
                    {error && (
                      <CAlert className="login-alert" color="danger">
                        {error}
                      </CAlert>
                    )}
                    <CInputGroup className="login-input-group mb-3">
                      <CInputGroupText className="login-input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        className="login-input"
                        name="email"
                        value={formulario.email}
                        onChange={handleChange}
                        placeholder="Correo electrónico"
                        autoComplete="email"
                        disabled={cargando}
                      />
                    </CInputGroup>
                    <CInputGroup className="login-input-group mb-4">
                      <CInputGroupText className="login-input-icon">
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        className="login-input"
                        type="password"
                        name="password"
                        value={formulario.password}
                        onChange={handleChange}
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        disabled={cargando}
                      />
                    </CInputGroup>
                    <CRow className="align-items-center">
                      <CCol xs={6} className="login-submit-col">
                        <CButton className="login-submit" type="submit" disabled={cargando}>
                          {cargando ? 'Ingresando...' : 'Iniciar sesión'}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-end">
                        <CButton color="link" className="login-link px-0">
                          ¿Olvidaste tu contraseña?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>

              <CCard className="login-card login-card--feature">
                <CCardBody className="login-card__body login-card__body--feature">
                  <div className="login-feature">
                    <span className="login-feature__badge">Brilliant Minds</span>
                    <h2>Forma parte de nuestra academia</h2>
                    <p>
                      Da el siguiente paso en tu formación con acompañamiento docente, cursos
                      especializados y un espacio pensado para alcanzar tus metas.
                    </p>
                    <Link to="/register" className="login-feature__link">
                      <CButton className="login-feature__btn" active tabIndex={-1}>
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
