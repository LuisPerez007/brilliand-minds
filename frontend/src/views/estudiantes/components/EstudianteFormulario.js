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
  feedback,
}) => {
  const feedbackRef = useRef(null)

  useEffect(() => {
    if (!feedback) return
    feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [feedback])

  return (
    <SectionCard
      title={editando ? 'Editar estudiante' : 'Registrar estudiante'}
      description="Completa los datos personales y de contacto."
      className="estudiante-form__card text-body"
    >
      {feedback && (
        <div ref={feedbackRef}>
          <CAlert color={feedback.color} className="mb-3">
            {feedback.message}
          </CAlert>
        </div>
      )}
      <CForm
        onSubmit={editando ? actualizarEstudiante : crearEstudiante}
        className="estudiante-form__form"
      >
        <CRow className="g-3 estudiante-form__grid">
          <CCol md={10}>
            <CFormLabel htmlFor="estudiante-nombre" className="estudiante-form__label">
              Nombre
            </CFormLabel>
            <CFormInput
              id="estudiante-nombre"
              name="nombre"
              value={formulario.nombre}
              onChange={handleChange}
              invalid={Boolean(errores.nombre)}
              aria-describedby={errores.nombre ? 'estudiante-nombre-error' : undefined}
              className="estudiante-form__input"
            />
            {errores.nombre && (
              <CFormFeedback id="estudiante-nombre-error" invalid>
                {errores.nombre}
              </CFormFeedback>
            )}
          </CCol>
          <CCol md={10}>
            <CFormLabel htmlFor="estudiante-apellido-paterno" className="estudiante-form__label">
              Apellido paterno
            </CFormLabel>
            <CFormInput
              id="estudiante-apellido-paterno"
              name="a_paterno"
              value={formulario.a_paterno}
              onChange={handleChange}
              invalid={Boolean(errores.a_paterno)}
              className="estudiante-form__input"
            />
            {errores.a_paterno && <CFormFeedback invalid>{errores.a_paterno}</CFormFeedback>}
          </CCol>
          <CCol md={10}>
            <CFormLabel htmlFor="estudiante-apellido-materno" className="estudiante-form__label">
              Apellido materno
            </CFormLabel>
            <CFormInput
              id="estudiante-apellido-materno"
              name="a_materno"
              value={formulario.a_materno ?? ''}
              onChange={handleChange}
              invalid={Boolean(errores.a_materno)}
              className="estudiante-form__input"
            />
            {errores.a_materno && <CFormFeedback invalid>{errores.a_materno}</CFormFeedback>}
          </CCol>
          <CCol md={6}>
            <CFormLabel htmlFor="estudiante-ci" className="estudiante-form__label">
              Documento CI
            </CFormLabel>
            <CFormInput
              id="estudiante-ci"
              name="ci"
              value={formulario.ci}
              onChange={handleChange}
              invalid={Boolean(errores.ci)}
              className="estudiante-form__input"
            />
            {errores.ci && <CFormFeedback invalid>{errores.ci}</CFormFeedback>}
          </CCol>
          <CCol md={6}>
            <CFormLabel htmlFor="estudiante-telefono" className="estudiante-form__label">
              Teléfono
            </CFormLabel>
            <CFormInput
              id="estudiante-telefono"
              name="telefono"
              type="number"
              value={formulario.telefono}
              onChange={handleChange}
              invalid={Boolean(errores.telefono)}
              className="estudiante-form__input"
            />
            {errores.telefono && <CFormFeedback invalid>{errores.telefono}</CFormFeedback>}
          </CCol>
          <CCol md={12}>
            <CFormLabel htmlFor="estudiante-direccion" className="estudiante-form__label">
              Dirección
            </CFormLabel>
            <CFormTextarea
              id="estudiante-direccion"
              name="direccion"
              rows={1}
              value={formulario.direccion}
              onChange={handleChange}
              invalid={Boolean(errores.direccion)}
              className="estudiante-form__input estudiante-form__textarea"
            />
            {errores.direccion && <CFormFeedback invalid>{errores.direccion}</CFormFeedback>}
          </CCol>
          <CCol md={12}>
            <CFormLabel htmlFor="estudiante-colegio" className="estudiante-form__label">
              Colegio
            </CFormLabel>
            <CFormInput
              id="estudiante-colegio"
              name="colegio"
              value={formulario.colegio ?? ''}
              onChange={handleChange}
              className="estudiante-form__input"
            />
          </CCol>

          <CCol md={12}>
            <CFormLabel htmlFor="estudiante-email" className="estudiante-form__label">
              Correo electrónico
            </CFormLabel>
            <CFormInput
              id="estudiante-email"
              name="email"
              type="email"
              value={formulario.email}
              onChange={handleChange}
              invalid={Boolean(errores.email)}
              className="estudiante-form__input"
            />
            {errores.email && <CFormFeedback invalid>{errores.email}</CFormFeedback>}
          </CCol>
          <CCol xs={12}>
            <div className="estudiante-form__tutor-panel">
              <CFormLabel htmlFor="estudiante-padre-tutor-ci" className="estudiante-form__label">
                Padre o tutor (buscar por CI)
              </CFormLabel>
              <div className="estudiante-form__tutor-row">
                <CFormInput
                  id="estudiante-padre-tutor-ci"
                  value={ciPadreTutorBusqueda}
                  onChange={(event) => setCiPadreTutorBusqueda(event.target.value)}
                  placeholder="Ingrese el CI del padre o tutor"
                  invalid={Boolean(errores.idTutor)}
                  className="estudiante-form__input"
                />
                <CButton
                  type="button"
                  color="primary"
                  variant="outline"
                  onClick={buscarPadreTutor}
                  className="estudiante-form__button"
                >
                  Buscar
                </CButton>
              </div>
              {errores.idTutor && <CFormFeedback invalid>{errores.idTutor}</CFormFeedback>}
              {padreTutorSeleccionado ? (
                <div className="estudiante-form__selected-tutor">
                  <strong>Padre/tutor seleccionado:</strong>{' '}
                  {padreTutorSeleccionado.estado === 'Activo' ? (
                    <>
                      {[
                        padreTutorSeleccionado.nombre,
                        padreTutorSeleccionado.apellidoPaterno ?? padreTutorSeleccionado.a_paterno,
                        padreTutorSeleccionado.apellidoMaterno ?? padreTutorSeleccionado.a_materno,
                      ]
                        .filter(Boolean)
                        .join(' ')}{' '}
                      (CI: {padreTutorSeleccionado.ci})
                    </>
                  ) : (
                    <p>
                      {[
                        padreTutorSeleccionado.nombre,
                        padreTutorSeleccionado.apellidoPaterno ?? padreTutorSeleccionado.a_paterno,
                        padreTutorSeleccionado.apellidoMaterno ?? padreTutorSeleccionado.a_materno,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      <br /> <strong style={{ color: 'red' }}>'Inactivo'</strong>
                    </p>
                  )}
                </div>
              ) : (
                <CButton
                  type="button"
                  color="warning"
                  variant="ghost"
                  className="estudiante-form__link px-0 mt-2"
                  onClick={abrirRegistroPadreTutor}
                >
                  No existe padre/tutor. Registrar primero
                </CButton>
              )}
            </div>
          </CCol>
        </CRow>
        <div className="estudiante-form__actions">
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
