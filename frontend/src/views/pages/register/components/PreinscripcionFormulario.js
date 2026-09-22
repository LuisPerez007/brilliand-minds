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
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={crearPreinscripcion}>
                  <h1>Preinscripción</h1>
                  <p className="text-body-secondary">
                    Completa el formulario para iniciar tu proceso de inscripción.
                  </p>
                  {feedback && (
                    <CAlert color={feedback.color} dismissible onClose={limpiarFeedback}>
                      {feedback.message}
                    </CAlert>
                  )}
                  <div className="mb-3">
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
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

                  <div className="mb-3">
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
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

                  <div className="mb-3">
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        name="a_materno"
                        value={formulario.a_materno}
                        onChange={handleChange}
                        placeholder="Apellido materno"
                        disabled={enviando}
                      />
                    </CInputGroup>
                  </div>

                  <div className="mb-3">
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilSchool} />
                      </CInputGroupText>
                      <CFormInput
                        name="colegio"
                        value={formulario.colegio}
                        onChange={handleChange}
                        placeholder="Colegio de procedencia"
                        disabled={enviando}
                      />
                    </CInputGroup>
                  </div>

                  <div className="mb-3">
                    <CInputGroup>
                      <CInputGroupText>CI</CInputGroupText>
                      <CFormInput
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

                  <div className="mb-3">
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilAddressBook} />
                      </CInputGroupText>
                      <CFormInput
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

                  <div className="mb-3">
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilPhone} />
                      </CInputGroupText>
                      <CFormInput
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

                  <div className="mb-3">
                    <CInputGroup>
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
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

                  <div className="d-grid gap-2">
                    <CButton color="success" type="submit" disabled={enviando}>
                      {enviando ? (
                        <>
                          <CSpinner size="sm" className="me-1" /> Enviando preinscripción...
                        </>
                      ) : (
                        'Enviar preinscripción'
                      )}
                    </CButton>
                    <CButton
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
