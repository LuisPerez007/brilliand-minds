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
  return (
    <SectionCard
      title={editando ? 'Editar curso' : 'Registrar curso'}
      description="Define la información académica, duración, precio y profesor responsable."
      className="bm-form-card"
    >
      <CForm onSubmit={editando ? actualizarCurso : crearCurso} className="bm-admin-form">
        <CRow className="g-3">
          <CCol md={6}>
            <CFormLabel htmlFor="curso-nombre">Nombre del curso</CFormLabel>
            <CFormInput
              id="curso-nombre"
              name="nombre"
              value={formulario.nombre}
              onChange={handleChange}
              invalid={Boolean(errores.nombre)}
            />
            {errores.nombre && <CFormFeedback invalid>{errores.nombre}</CFormFeedback>}
          </CCol>
          <CCol md={6}>
            <CFormLabel htmlFor="curso-profesor">Profesor responsable</CFormLabel>
            <CFormSelect
              id="curso-profesor"
              name="idProfesor"
              value={formulario.idProfesor}
              onChange={handleChange}
              invalid={Boolean(errores.idProfesor)}
            >
              <option value="">Seleccionar profesor</option>
              {profesor?.map((profesorItem) => (
                <option key={profesorItem.id_profesor} value={profesorItem.id_profesor}>
                  {profesorItem.nombre} {profesorItem.a_paterno} {profesorItem.a_materno}
                </option>
              ))}
            </CFormSelect>
            {errores.idProfesor && <CFormFeedback invalid>{errores.idProfesor}</CFormFeedback>}
          </CCol>
          <CCol xs={12}>
            <CFormLabel htmlFor="curso-descripcion">Descripción</CFormLabel>
            <CFormTextarea
              id="curso-descripcion"
              name="descripcion"
              rows={3}
              value={formulario.descripcion}
              onChange={handleChange}
              invalid={Boolean(errores.descripcion)}
            />
            {errores.descripcion && <CFormFeedback invalid>{errores.descripcion}</CFormFeedback>}
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="curso-duracion">Duración</CFormLabel>
            <CFormInput
              id="curso-duracion"
              type="number"
              name="duracion"
              value={formulario.duracion}
              onChange={handleChange}
              invalid={Boolean(errores.duracion)}
            />
            {errores.duracion && <CFormFeedback invalid>{errores.duracion}</CFormFeedback>}
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="curso-unidad">Unidad de duración</CFormLabel>
            <CFormSelect
              id="curso-unidad"
              name="unidad"
              value={formulario.unidad}
              onChange={handleChange}
              invalid={Boolean(errores.unidad)}
            >
              <option value="">Seleccionar unidad</option>
              <option value="hours">Horas</option>
              <option value="days">Días</option>
              <option value="weeks">Semanas</option>
              <option value="months">Meses</option>
            </CFormSelect>
            {errores.unidad && <CFormFeedback invalid>{errores.unidad}</CFormFeedback>}
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="curso-cupos">Cupos disponibles</CFormLabel>
            <CFormInput
              id="curso-cupos"
              type="number"
              name="cupos"
              value={formulario.cupos}
              onChange={handleChange}
              invalid={Boolean(errores.cupos)}
            />
            {errores.cupos && <CFormFeedback invalid>{errores.cupos}</CFormFeedback>}
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="curso-precio">Precio</CFormLabel>
            <CFormInput
              id="curso-precio"
              type="number"
              name="precio"
              value={formulario.precio}
              onChange={handleChange}
              invalid={Boolean(errores.precio)}
            />
            {errores.precio && <CFormFeedback invalid>{errores.precio}</CFormFeedback>}
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
