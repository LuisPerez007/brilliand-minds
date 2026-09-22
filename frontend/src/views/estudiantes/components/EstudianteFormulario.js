import {
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
import { SectionCard } from '../../../components'

const EstudianteFormulario = ({
  formulario,
  errores,
  editando,
  handleChange,
  crearEstudiante,
  actualizarEstudiante,
  descartar,
  accionEnProceso,
  ciPadreTutorBusqueda,
  setCiPadreTutorBusqueda,
  buscarPadreTutor,
  padreTutorSeleccionado,
  abrirRegistroPadreTutor,
}) => {
  return (
    <SectionCard
      title={editando ? 'Editar estudiante' : 'Registrar estudiante'}
      description="Completa los datos personales y de contacto."
      className="bm-form-card"
    >
      <CForm onSubmit={editando ? actualizarEstudiante : crearEstudiante} className="bm-admin-form">
        <CRow className="g-3">
          <CCol md={4}>
            <CFormLabel htmlFor="estudiante-nombre">Nombre</CFormLabel>
            <CFormInput
              id="estudiante-nombre"
              name="nombre"
              value={formulario.nombre}
              onChange={handleChange}
              invalid={Boolean(errores.nombre)}
              aria-describedby={errores.nombre ? 'estudiante-nombre-error' : undefined}
            />
            {errores.nombre && (
              <CFormFeedback id="estudiante-nombre-error" invalid>
                {errores.nombre}
              </CFormFeedback>
            )}
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="estudiante-apellido-paterno">Apellido paterno</CFormLabel>
            <CFormInput
              id="estudiante-apellido-paterno"
              name="a_paterno"
              value={formulario.a_paterno}
              onChange={handleChange}
              invalid={Boolean(errores.a_paterno)}
            />
            {errores.a_paterno && <CFormFeedback invalid>{errores.a_paterno}</CFormFeedback>}
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="estudiante-apellido-materno">Apellido materno</CFormLabel>
            <CFormInput
              id="estudiante-apellido-materno"
              name="a_materno"
              value={formulario.a_materno ?? ''}
              onChange={handleChange}
              invalid={Boolean(errores.a_materno)}
            />
            {errores.a_materno && <CFormFeedback invalid>{errores.a_materno}</CFormFeedback>}
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="estudiante-ci">Carnet de identidad</CFormLabel>
            <CFormInput
              id="estudiante-ci"
              name="ci"
              value={formulario.ci}
              onChange={handleChange}
              invalid={Boolean(errores.ci)}
            />
            {errores.ci && <CFormFeedback invalid>{errores.ci}</CFormFeedback>}
          </CCol>
          <CCol md={8}>
            <CFormLabel htmlFor="estudiante-direccion">Dirección</CFormLabel>
            <CFormTextarea
              id="estudiante-direccion"
              name="direccion"
              rows={1}
              value={formulario.direccion}
              onChange={handleChange}
              invalid={Boolean(errores.direccion)}
            />
            {errores.direccion && <CFormFeedback invalid>{errores.direccion}</CFormFeedback>}
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="estudiante-colegio">Colegio</CFormLabel>
            <CFormInput
              id="estudiante-colegio"
              name="colegio"
              value={formulario.colegio ?? ''}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="estudiante-telefono">Teléfono</CFormLabel>
            <CFormInput
              id="estudiante-telefono"
              name="telefono"
              type="number"
              value={formulario.telefono}
              onChange={handleChange}
              invalid={Boolean(errores.telefono)}
            />
            {errores.telefono && <CFormFeedback invalid>{errores.telefono}</CFormFeedback>}
          </CCol>
          <CCol md={8}>
            <CFormLabel htmlFor="estudiante-email">Correo electrónico</CFormLabel>
            <CFormInput
              id="estudiante-email"
              name="email"
              type="email"
              value={formulario.email}
              onChange={handleChange}
              invalid={Boolean(errores.email)}
            />
            {errores.email && <CFormFeedback invalid>{errores.email}</CFormFeedback>}
          </CCol>
          <CCol xs={12}>
            <div className="border rounded p-3 bg-body-tertiary">
              <CFormLabel htmlFor="estudiante-padre-tutor-ci">
                Padre o tutor (buscar por CI)
              </CFormLabel>
              <div className="d-flex gap-2">
                <CFormInput
                  id="estudiante-padre-tutor-ci"
                  value={ciPadreTutorBusqueda}
                  onChange={(event) => setCiPadreTutorBusqueda(event.target.value)}
                  placeholder="Ingrese el CI del padre o tutor"
                  invalid={Boolean(errores.idTutor)}
                />
                <CButton type="button" color="primary" variant="outline" onClick={buscarPadreTutor}>
                  Buscar
                </CButton>
              </div>
              {errores.idTutor && <CFormFeedback invalid>{errores.idTutor}</CFormFeedback>}
              {padreTutorSeleccionado ? (
                <div className="mt-2 text-success">
                  <strong>Padre/tutor seleccionado:</strong>{' '}
                  {[
                    padreTutorSeleccionado.nombre,
                    padreTutorSeleccionado.apellidoPaterno ?? padreTutorSeleccionado.a_paterno,
                    padreTutorSeleccionado.apellidoMaterno ?? padreTutorSeleccionado.a_materno,
                  ]
                    .filter(Boolean)
                    .join(' ')}{' '}
                  (CI: {padreTutorSeleccionado.ci})
                </div>
              ) : (
                <CButton
                  type="button"
                  color="warning"
                  variant="ghost"
                  className="px-0 mt-2"
                  onClick={abrirRegistroPadreTutor}
                >
                  No existe padre/tutor. Registrar primero
                </CButton>
              )}
            </div>
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
                'Actualizar estudiante'
              ) : (
                'Guardar estudiante'
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

export default EstudianteFormulario
