import React from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilAddressBook, cilPhone, cilSchool } from '@coreui/icons'

const PreinscripcionFormulario = ({
  formulario,
  handleChange,
  crearPreinscripcion,
  errores,
  feedback,
  limpiarFeedback,
  enviando,
  volverAlLogin,
}) => {
  return (
    <div className="preinscripcion-page" data-coreui-theme="light">
      <CContainer className="preinscripcion-container">
        <CRow className="justify-content-center">
          <CCol md={10} lg={8} xl={7}>
            <CCard className="preinscripcion-card">
              <CCardBody className="preinscripcion-card__body">
                <CForm onSubmit={crearPreinscripcion} className="preinscripcion-form">
                  <div className="preinscripcion-header">
                    <span className="preinscripcion-header__eyebrow">Academia</span>
                    <h1>Preinscripción</h1>
                    <p>Completa el formulario para iniciar tu proceso de inscripción.</p>
                  </div>

                  {feedback && (
                    <CAlert
                      className="preinscripcion-alert"
                      color={feedback.color}
                      dismissible
                      onClose={limpiarFeedback}
                    >
                      {feedback.message}
                    </CAlert>
                  )}

                  <CRow className="g-3">
                    <CCol md={6}>
                      <div className="preinscripcion-field">
                        <CInputGroup className="preinscripcion-input-group">
                          <CInputGroupText className="preinscripcion-input-icon">
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            className="preinscripcion-input"
                            name="nombre"
                            value={formulario.nombre}
                            onChange={handleChange}
                            placeholder="Nombre"
                            disabled={enviando}
                            invalid={Boolean(errores.nombre)}
                          />
                        </CInputGroup>
                        {errores.nombre && (
                          <CFormFeedback invalid className="d-block">
                            {errores.nombre}
                          </CFormFeedback>
                        )}
                      </div>
                    </CCol>

                    <CCol md={6}>
                      <div className="preinscripcion-field">
                        <CInputGroup className="preinscripcion-input-group">
                          <CInputGroupText className="preinscripcion-input-icon">
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            className="preinscripcion-input"
                            name="a_paterno"
                            value={formulario.a_paterno}
                            onChange={handleChange}
                            placeholder="Apellido paterno"
                            disabled={enviando}
                            invalid={Boolean(errores.a_paterno)}
                          />
                        </CInputGroup>
                        {errores.a_paterno && (
                          <CFormFeedback invalid className="d-block">
                            {errores.a_paterno}
                          </CFormFeedback>
                        )}
                      </div>
                    </CCol>

                    <CCol md={6}>
                      <div className="preinscripcion-field">
                        <CInputGroup className="preinscripcion-input-group">
                          <CInputGroupText className="preinscripcion-input-icon">
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            className="preinscripcion-input"
                            name="a_materno"
                            value={formulario.a_materno}
                            onChange={handleChange}
                            placeholder="Apellido materno"
                            disabled={enviando}
                          />
                        </CInputGroup>
                      </div>
                    </CCol>

                    <CCol md={6}>
                      <div className="preinscripcion-field">
                        <CInputGroup className="preinscripcion-input-group">
                          <CInputGroupText className="preinscripcion-input-icon">
                            <CIcon icon={cilSchool} />
                          </CInputGroupText>
                          <CFormInput
                            className="preinscripcion-input"
                            name="colegio"
                            value={formulario.colegio}
                            onChange={handleChange}
                            placeholder="Colegio de procedencia"
                            disabled={enviando}
                          />
                        </CInputGroup>
                      </div>
                    </CCol>

                    <CCol md={6}>
                      <div className="preinscripcion-field">
                        <CInputGroup className="preinscripcion-input-group">
                          <CInputGroupText className="preinscripcion-input-label">
                            CI
                          </CInputGroupText>
                          <CFormInput
                            className="preinscripcion-input"
                            name="ci"
                            value={formulario.ci}
                            onChange={handleChange}
                            placeholder="Carnet de identidad"
                            disabled={enviando}
                            invalid={Boolean(errores.ci)}
                          />
                        </CInputGroup>
                        {errores.ci && (
                          <CFormFeedback invalid className="d-block">
                            {errores.ci}
                          </CFormFeedback>
                        )}
                      </div>
                    </CCol>

                    <CCol md={6}>
                      <div className="preinscripcion-field">
                        <CInputGroup className="preinscripcion-input-group">
                          <CInputGroupText className="preinscripcion-input-icon">
                            <CIcon icon={cilAddressBook} />
                          </CInputGroupText>
                          <CFormInput
                            className="preinscripcion-input"
                            name="direccion"
                            value={formulario.direccion}
                            onChange={handleChange}
                            placeholder="Dirección"
                            disabled={enviando}
                            invalid={Boolean(errores.direccion)}
                          />
                        </CInputGroup>
                        {errores.direccion && (
                          <CFormFeedback invalid className="d-block">
                            {errores.direccion}
                          </CFormFeedback>
                        )}
                      </div>
                    </CCol>

                    <CCol md={6}>
                      <div className="preinscripcion-field">
                        <CInputGroup className="preinscripcion-input-group">
                          <CInputGroupText className="preinscripcion-input-icon">
                            <CIcon icon={cilPhone} />
                          </CInputGroupText>
                          <CFormInput
                            className="preinscripcion-input"
                            name="telefono"
                            value={formulario.telefono}
                            onChange={handleChange}
                            placeholder="Teléfono"
                            disabled={enviando}
                            invalid={Boolean(errores.telefono)}
                          />
                        </CInputGroup>
                        {errores.telefono && (
                          <CFormFeedback invalid className="d-block">
                            {errores.telefono}
                          </CFormFeedback>
                        )}
                      </div>
                    </CCol>

                    <CCol md={6}>
                      <div className="preinscripcion-field">
                        <CInputGroup className="preinscripcion-input-group">
                          <CInputGroupText className="preinscripcion-input-label">
                            @
                          </CInputGroupText>
                          <CFormInput
                            className="preinscripcion-input"
                            type="email"
                            name="email"
                            value={formulario.email}
                            onChange={handleChange}
                            placeholder="Correo electrónico"
                            autoComplete="email"
                            disabled={enviando}
                            invalid={Boolean(errores.email)}
                          />
                        </CInputGroup>
                        {errores.email && (
                          <CFormFeedback invalid className="d-block">
                            {errores.email}
                          </CFormFeedback>
                        )}
                      </div>
                    </CCol>
                  </CRow>

                  <div className="preinscripcion-actions">
                    <CButton className="preinscripcion-submit" type="submit" disabled={enviando}>
                      {enviando ? (
                        <>
                          <CSpinner size="sm" className="me-1" /> Enviando preinscripción...
                        </>
                      ) : (
                        'Enviar preinscripción'
                      )}
                    </CButton>
                    <CButton
                      className="preinscripcion-cancel"
                      color="secondary"
                      variant="outline"
                      type="button"
                      onClick={volverAlLogin}
                    >
                      Volver al Login
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default PreinscripcionFormulario
