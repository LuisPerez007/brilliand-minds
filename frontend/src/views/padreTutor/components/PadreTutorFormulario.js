import {
  CAlert,
  CButton,
  CButtonGroup,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CSpinner,
} from '@coreui/react'

const PadreTutorFormulario = ({
  formulario,
  errores,
  editando,
  handleChange,
  crearPadreTutor,
  actualizarPadreTutor,
  descartar,
  accionEnProceso,
}) => {
  return (
    <CAlert color="warning" className="mb-0">
      <CForm onSubmit={editando ? actualizarPadreTutor : crearPadreTutor} className="bm-admin-form">
        <CRow className="g-3">
          <CCol md={4}>
            <CFormLabel htmlFor="padre-tutor-nombre">Nombre</CFormLabel>
            <CFormInput
              id="padre-tutor-nombre"
              name="nombre"
              value={formulario.nombre}
              onChange={handleChange}
              invalid={Boolean(errores.nombre)}
            />
            {errores.nombre && <CFormFeedback invalid>{errores.nombre}</CFormFeedback>}
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="padre-tutor-apellido-paterno">Apellido paterno</CFormLabel>
            <CFormInput
              id="padre-tutor-apellido-paterno"
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
            <CFormLabel htmlFor="padre-tutor-apellido-materno">Apellido materno</CFormLabel>
            <CFormInput
              id="padre-tutor-apellido-materno"
              name="apellidoMaterno"
              value={formulario.apellidoMaterno}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="padre-tutor-ci">Carnet de identidad</CFormLabel>
            <CFormInput
              id="padre-tutor-ci"
              name="ci"
              value={formulario.ci}
              onChange={handleChange}
              invalid={Boolean(errores.ci)}
            />
            {errores.ci && <CFormFeedback invalid>{errores.ci}</CFormFeedback>}
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="padre-tutor-telefono">Teléfono</CFormLabel>
            <CFormInput
              id="padre-tutor-telefono"
              name="telefono"
              type="number"
              value={formulario.telefono}
              onChange={handleChange}
              invalid={Boolean(errores.telefono)}
            />
            {errores.telefono && <CFormFeedback invalid>{errores.telefono}</CFormFeedback>}
          </CCol>
          <CCol md={8}>
            <CFormLabel htmlFor="padre-tutor-direccion">Dirección</CFormLabel>
            <CFormTextarea
              id="padre-tutor-direccion"
              name="direccion"
              rows={1}
              value={formulario.direccion}
              onChange={handleChange}
              invalid={Boolean(errores.direccion)}
            />
            {errores.direccion && <CFormFeedback invalid>{errores.direccion}</CFormFeedback>}
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
                'Actualizar padre o tutor'
              ) : (
                'Guardar padre o tutor'
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
    </CAlert>
  )
}

export default PadreTutorFormulario
