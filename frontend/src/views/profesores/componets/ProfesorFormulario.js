import { useEffect, useRef } from 'react'
import {
  CAlert,
  CButton,
  CButtonGroup,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
} from '@coreui/react'
import { SectionCard } from '../../../components'

const ProfesorFormulario = ({
  handleChange,
  descartar,
  editando,
  actualizarProfesor,
  crearProfesor,
  formulario,
  errores,
  accionEnProceso,
  feedback,
}) => {
  const feedbackRef = useRef(null)

  useEffect(() => {
    if (!feedback) return
    feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [feedback])

  return (
    <SectionCard
      title={editando ? 'Editar profesor' : 'Registrar profesor'}
      description="Completa los datos personales y profesionales del docente."
      className="profesor-form__card bm-form-card text-body"
    >
      {feedback && (
        <div ref={feedbackRef}>
          <CAlert color={feedback.color} className="mb-3">
            {feedback.message}
          </CAlert>
        </div>
      )}
      <CForm
        onSubmit={editando ? actualizarProfesor : crearProfesor}
        className="profesor-form__form bm-admin-form"
      >
        <CRow className="g-3 profesor-form__grid">
          <CCol md={10} className="profesor-form__field">
            <CFormLabel htmlFor="profesor-nombre">Nombre</CFormLabel>
            <CFormInput
              id="profesor-nombre"
              name="nombre"
              value={formulario.nombre}
              onChange={handleChange}
              invalid={Boolean(errores.nombre)}
              className="profesor-form__input"
            />
            {errores.nombre && <CFormFeedback invalid>{errores.nombre}</CFormFeedback>}
          </CCol>
          <CCol md={10} className="profesor-form__field">
            <CFormLabel htmlFor="profesor-apellido-paterno">Apellido paterno</CFormLabel>
            <CFormInput
              id="profesor-apellido-paterno"
              name="apellidoPaterno"
              value={formulario.apellidoPaterno}
              onChange={handleChange}
              invalid={Boolean(errores.apellidoPaterno)}
              className="profesor-form__input"
            />
            {errores.apellidoPaterno && (
              <CFormFeedback invalid>{errores.apellidoPaterno}</CFormFeedback>
            )}
          </CCol>
          <CCol md={10} className="profesor-form__field">
            <CFormLabel htmlFor="profesor-apellido-materno">Apellido materno</CFormLabel>
            <CFormInput
              id="profesor-apellido-materno"
              name="apellidoMaterno"
              value={formulario.apellidoMaterno ?? ''}
              onChange={handleChange}
              invalid={Boolean(errores.apellidoMaterno)}
              className="profesor-form__input"
            />
            {errores.apellidoMaterno && (
              <CFormFeedback invalid>{errores.apellidoMaterno}</CFormFeedback>
            )}
          </CCol>
          <CCol md={6} className="profesor-form__field">
            <CFormLabel htmlFor="profesor-ci">Documento CI</CFormLabel>
            <CFormInput
              id="profesor-ci"
              name="ci"
              value={formulario.ci}
              onChange={handleChange}
              invalid={Boolean(errores.ci)}
              className="profesor-form__input"
            />
            {errores.ci && <CFormFeedback invalid>{errores.ci}</CFormFeedback>}
          </CCol>
          <CCol md={6} className="profesor-form__field">
            <CFormLabel htmlFor="profesor-telefono">Teléfono</CFormLabel>
            <CFormInput
              id="profesor-telefono"
              name="telefono"
              type="number"
              value={formulario.telefono ?? ''}
              onChange={handleChange}
              invalid={Boolean(errores.telefono)}
              className="profesor-form__input"
            />
            {errores.telefono && <CFormFeedback invalid>{errores.telefono}</CFormFeedback>}
          </CCol>
          <CCol md={10} className="profesor-form__field">
            <CFormLabel htmlFor="profesor-especialidad">Especialidad</CFormLabel>
            <CFormInput
              id="profesor-especialidad"
              name="especialidad"
              value={formulario.especialidad}
              onChange={handleChange}
              invalid={Boolean(errores.especialidad)}
              className="profesor-form__input"
            />
            {errores.especialidad && <CFormFeedback invalid>{errores.especialidad}</CFormFeedback>}
          </CCol>
          <CCol md={10} className="profesor-form__field profesor-form__field--wide">
            <CFormLabel htmlFor="profesor-email">Correo electrónico</CFormLabel>
            <CFormInput
              id="profesor-email"
              name="email"
              type="email"
              value={formulario.email ?? ''}
              onChange={handleChange}
              invalid={Boolean(errores.email)}
              className="profesor-form__input"
            />
            {errores.email && <CFormFeedback invalid>{errores.email}</CFormFeedback>}
          </CCol>
        </CRow>
        <div className="profesor-form__actions bm-form-actions">
          <CButtonGroup>
            <CButton color="primary" type="submit" disabled={Boolean(accionEnProceso)}>
              {accionEnProceso === (editando ? 'actualizar' : 'guardar') ? (
                <>
                  <CSpinner size="sm" className="me-1" /> Procesando
                </>
              ) : editando ? (
                'Actualizar profesor'
              ) : (
                'Guardar profesor'
              )}
            </CButton>
            {editando && (
              <CButton
                color="secondary"
                variant="outline"
                type="button"
                onClick={descartar}
                disabled={Boolean(accionEnProceso)}
              >
                Descartar
              </CButton>
            )}
          </CButtonGroup>
        </div>
      </CForm>
    </SectionCard>
  )
}

export default ProfesorFormulario
