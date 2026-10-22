import {
  CButton,
  CButtonGroup,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
  CSpinner,
} from '@coreui/react'
import { SectionCard } from '../../../components'

const CursoFormulario = ({
  profesor,
  editando,
  actualizarCurso,
  crearCurso,
  formulario,
  handleChange,
  errores,
  descartar,
  accionEnProceso,
}) => {
  const fechaActual = new Date()
  const fechaMinima = `${fechaActual.getFullYear()}-${String(fechaActual.getMonth() + 1).padStart(2, '0')}-${String(fechaActual.getDate()).padStart(2, '0')}`

  return (
    <SectionCard
      title={editando ? 'Editar curso' : 'Registrar curso'}
      description="Define la información académica, duración, precio y profesor responsable."
      className="curso-form__card bm-form-card text-body"
    >
      <CForm
        onSubmit={editando ? actualizarCurso : crearCurso}
        className="curso-form__form bm-admin-form"
        noValidate
      >
        <CRow className="g-3 curso-form__grid">
          <CCol md={10} className="curso-form__field">
            <CFormLabel htmlFor="curso-nombre">Nombre del curso</CFormLabel>
            <CFormInput
              id="curso-nombre"
              name="nombre"
              value={formulario.nombre}
              onChange={handleChange}
              invalid={Boolean(errores.nombre)}
              className="curso-form__input"
            />
            {errores.nombre && <CFormFeedback invalid>{errores.nombre}</CFormFeedback>}
          </CCol>
          <CCol md={10} className="curso-form__field">
            <CFormLabel htmlFor="curso-profesor">Profesor responsable</CFormLabel>
            <CFormSelect
              id="curso-profesor"
              name="idProfesor"
              value={formulario.idProfesor}
              onChange={handleChange}
              invalid={Boolean(errores.idProfesor)}
              className="curso-form__input"
            >
              <option value="">Seleccionar profesor</option>
              {profesor
                ?.filter((profe) => {
                  if (profe.estado === 'Activo') {
                    return profe.estado
                  }
                })
                .map((profesorItem) => (
                  <option key={profesorItem.id_profesor} value={profesorItem.id_profesor}>
                    {profesorItem.nombre} {profesorItem.a_paterno} {profesorItem.a_materno}
                  </option>
                ))}
            </CFormSelect>
            {errores.idProfesor && <CFormFeedback invalid>{errores.idProfesor}</CFormFeedback>}
          </CCol>
          <CCol xs={12} className="curso-form__field">
            <CFormLabel htmlFor="curso-descripcion">Descripción</CFormLabel>
            <CFormTextarea
              id="curso-descripcion"
              name="descripcion"
              rows={3}
              value={formulario.descripcion}
              onChange={handleChange}
              invalid={Boolean(errores.descripcion)}
              className="curso-form__input curso-form__textarea"
            />
            {errores.descripcion && <CFormFeedback invalid>{errores.descripcion}</CFormFeedback>}
          </CCol>
          <CCol md={6} className="curso-form__field">
            <CFormLabel htmlFor="curso-duracion">Duración</CFormLabel>
            <CFormInput
              id="curso-duracion"
              type="number"
              name="duracion"
              value={formulario.duracion}
              onChange={handleChange}
              invalid={Boolean(errores.duracion)}
              className="curso-form__input"
            />
            {errores.duracion && <CFormFeedback invalid>{errores.duracion}</CFormFeedback>}
          </CCol>
          <CCol md={6} className="curso-form__field">
            <CFormLabel htmlFor="curso-unidad">Tiempo</CFormLabel>
            <CFormSelect
              id="curso-unidad"
              name="unidad"
              value={formulario.unidad}
              onChange={handleChange}
              invalid={Boolean(errores.unidad)}
              className="curso-form__input"
            >
              <option value="months">Meses</option>
              <option value="weeks">Semanas</option>
              <option value="days">Días</option>
              <option value="hours">Horas</option>
            </CFormSelect>
            {errores.unidad && <CFormFeedback invalid>{errores.unidad}</CFormFeedback>}
          </CCol>
          <CCol md={6} className="curso-form__field">
            <CFormLabel htmlFor="curso-cupos">Vacantes</CFormLabel>
            <CFormInput
              id="curso-cupos"
              type="number"
              name="cupos"
              value={formulario.cupos}
              onChange={handleChange}
              invalid={Boolean(errores.cupos)}
              className="curso-form__input"
            />
            {errores.cupos && <CFormFeedback invalid>{errores.cupos}</CFormFeedback>}
          </CCol>
          <CCol md={6} className="curso-form__field">
            <CFormLabel htmlFor="curso-precio">Precio</CFormLabel>
            <CFormInput
              id="curso-precio"
              type="number"
              name="precio"
              value={formulario.precio}
              onChange={handleChange}
              invalid={Boolean(errores.precio)}
              className="curso-form__input"
            />
            {errores.precio && <CFormFeedback invalid>{errores.precio}</CFormFeedback>}
          </CCol>
          <CCol md={6} className="curso-form__field">
            <CFormLabel htmlFor="curso-fecha-creacion">Fecha de creación</CFormLabel>
            <CFormInput
              id="curso-fecha-creacion"
              type="date"
              name="fechaCreacion"
              value={formulario.fechaCreacion}
              min={fechaMinima}
              onChange={handleChange}
              invalid={Boolean(errores.fechaCreacion)}
              required
              className="curso-form__input"
            />
            {errores.fechaCreacion && (
              <CFormFeedback invalid>{errores.fechaCreacion}</CFormFeedback>
            )}
          </CCol>
        </CRow>
        <div className="curso-form__actions bm-form-actions">
          <CButtonGroup>
            <CButton color="primary" type="submit" disabled={Boolean(accionEnProceso)}>
              {accionEnProceso === (editando ? 'actualizar' : 'guardar') ? (
                <>
                  <CSpinner size="sm" className="me-1" /> Procesando
                </>
              ) : editando ? (
                'Actualizar curso'
              ) : (
                'Guardar curso'
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

export default CursoFormulario
