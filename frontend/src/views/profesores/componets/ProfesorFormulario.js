import {
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
}) => {
  return (
    <SectionCard
      title={editando ? 'Editar profesor' : 'Registrar profesor'}
      description="Completa los datos personales y profesionales del docente."
      className="bm-form-card"
    >
      <CForm onSubmit={editando ? actualizarProfesor : crearProfesor} className="bm-admin-form">
        <CRow className="g-3">
          <CCol md={4}>
            <CFormLabel htmlFor="profesor-nombre">Nombre</CFormLabel>
            <CFormInput
              id="profesor-nombre"
              name="nombre"
              value={formulario.nombre}
              onChange={handleChange}
              invalid={Boolean(errores.nombre)}
            />
            {errores.nombre && <CFormFeedback invalid>{errores.nombre}</CFormFeedback>}
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="profesor-apellido-paterno">Apellido paterno</CFormLabel>
            <CFormInput
              id="profesor-apellido-paterno"
              name="apellidoPaterno"
              value={formulario.apellidoPaterno}
              onChange={handleChange}
              invalid={Boolean(errores.apellidoPaterno)}
            />
            {errores.apellidoPaterno && (
              <CFormFeedback invalid>{errores.apellidoPaterno}</CFormFeedback>
            )}
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="profesor-apellido-materno">Apellido materno</CFormLabel>
            <CFormInput
              id="profesor-apellido-materno"
              name="apellidoMaterno"
              value={formulario.apellidoMaterno ?? ''}
              onChange={handleChange}
              invalid={Boolean(errores.apellidoMaterno)}
            />
            {errores.apellidoMaterno && (
              <CFormFeedback invalid>{errores.apellidoMaterno}</CFormFeedback>
            )}
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="profesor-ci">Carnet de identidad</CFormLabel>
            <CFormInput
              id="profesor-ci"
              name="ci"
              value={formulario.ci}
              onChange={handleChange}
              invalid={Boolean(errores.ci)}
            />
            {errores.ci && <CFormFeedback invalid>{errores.ci}</CFormFeedback>}
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="profesor-telefono">Teléfono</CFormLabel>
            <CFormInput
              id="profesor-telefono"
              name="telefono"
              type="number"
              value={formulario.telefono ?? ''}
              onChange={handleChange}
              invalid={Boolean(errores.telefono)}
            />
            {errores.telefono && <CFormFeedback invalid>{errores.telefono}</CFormFeedback>}
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="profesor-especialidad">Especialidad</CFormLabel>
            <CFormInput
              id="profesor-especialidad"
              name="especialidad"
              value={formulario.especialidad}
              onChange={handleChange}
              invalid={Boolean(errores.especialidad)}
            />
            {errores.especialidad && <CFormFeedback invalid>{errores.especialidad}</CFormFeedback>}
          </CCol>
          <CCol md={8}>
            <CFormLabel htmlFor="profesor-email">Correo electrónico</CFormLabel>
            <CFormInput
              id="profesor-email"
              name="email"
              type="email"
              value={formulario.email ?? ''}
              onChange={handleChange}
              invalid={Boolean(errores.email)}
            />
            {errores.email && <CFormFeedback invalid>{errores.email}</CFormFeedback>}
          </CCol>
        </CRow>
        <div className="bm-form-actions">
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
