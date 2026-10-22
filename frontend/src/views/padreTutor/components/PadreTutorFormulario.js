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
    <CAlert color="warning" className="tutor-form__card mb-0">
      <CForm
        onSubmit={editando ? actualizarPadreTutor : crearPadreTutor}
        className="tutor-form__form bm-admin-form"
      >
        <CRow className="g-3 tutor-form__grid">
          <CCol md={10} className="tutor-form__field">
            <CFormLabel htmlFor="padre-tutor-nombre">Nombre</CFormLabel>
            <CFormInput
              id="padre-tutor-nombre"
              name="nombre"
              value={formulario.nombre}
              onChange={handleChange}
              invalid={Boolean(errores.nombre)}
              className="tutor-form__input"
            />
            {errores.nombre && <CFormFeedback invalid>{errores.nombre}</CFormFeedback>}
          </CCol>
          <CCol md={10} className="tutor-form__field">
            <CFormLabel htmlFor="padre-tutor-apellido-paterno">Apellido paterno</CFormLabel>
            <CFormInput
              id="padre-tutor-apellido-paterno"
              name="apellidoPaterno"
              value={formulario.apellidoPaterno}
              onChange={handleChange}
              invalid={Boolean(errores.apellidoPaterno)}
              className="tutor-form__input"
            />
            {errores.apellidoPaterno && (
              <CFormFeedback invalid>{errores.apellidoPaterno}</CFormFeedback>
            )}
          </CCol>
          <CCol md={10} className="tutor-form__field">
            <CFormLabel htmlFor="padre-tutor-apellido-materno">Apellido materno</CFormLabel>
            <CFormInput
              id="padre-tutor-apellido-materno"
              name="apellidoMaterno"
              value={formulario.apellidoMaterno}
              onChange={handleChange}
              className="tutor-form__input"
            />
          </CCol>
          <CCol md={6} className="tutor-form__field">
            <CFormLabel htmlFor="padre-tutor-ci">Documento CI</CFormLabel>
            <CFormInput
              id="padre-tutor-ci"
              name="ci"
              value={formulario.ci}
              onChange={handleChange}
              invalid={Boolean(errores.ci)}
              className="tutor-form__input"
            />
            {errores.ci && <CFormFeedback invalid>{errores.ci}</CFormFeedback>}
          </CCol>
          <CCol md={6} className="tutor-form__field">
            <CFormLabel htmlFor="padre-tutor-telefono">Teléfono</CFormLabel>
            <CFormInput
              id="padre-tutor-telefono"
              name="telefono"
              type="number"
              value={formulario.telefono}
              onChange={handleChange}
              invalid={Boolean(errores.telefono)}
              className="tutor-form__input"
            />
            {errores.telefono && <CFormFeedback invalid>{errores.telefono}</CFormFeedback>}
          </CCol>
          <CCol md={10} className="tutor-form__field tutor-form__field--wide">
            <CFormLabel htmlFor="padre-tutor-direccion">Dirección</CFormLabel>
            <CFormTextarea
              id="padre-tutor-direccion"
              name="direccion"
              rows={1}
              value={formulario.direccion}
              onChange={handleChange}
              invalid={Boolean(errores.direccion)}
              className="tutor-form__input tutor-form__textarea"
            />
            {errores.direccion && <CFormFeedback invalid>{errores.direccion}</CFormFeedback>}
          </CCol>
        </CRow>
        <div className="tutor-form__actions bm-form-actions">
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
