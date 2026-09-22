import { Fragment } from 'react'
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { SectionCard, LoadingState, EmptyState } from '../../../components'

const TablaProfesores = ({
  inscripcionesPorProfesor,
  eliminarInscripcionId,
  idProfesorSeleccionado,
  cargando,
  eliminarInscripcionPorCurso,
  cursoParaEliminar,
  cancelarEliminacionCurso,
  confirmarEliminacionCurso,
}) => {
  const datos = inscripcionesPorProfesor?.datos || []
  const cursosUnicos = [...new Set(datos.map((dat) => dat.curso || 'Sin curso'))]
  const totalEstudiantes = datos.filter((dat) => dat.estudiante !== null).length

  return (
    <div className="reporte">
      {cursoParaEliminar && (
        <CModal
          visible={Boolean(cursoParaEliminar)}
          onClose={cancelarEliminacionCurso}
          alignment="center"
        >
          <CModalHeader>
            <CModalTitle>Finalizar curso</CModalTitle>
          </CModalHeader>
          <CModalBody>
            ¿Deseas finalizar el curso <strong>{cursoParaEliminar.nombreCurso}</strong> para este
            profesor? Esta acción eliminará todas las inscripciones de ese curso.
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              variant="outline"
              onClick={cancelarEliminacionCurso}
              disabled={cargando}
            >
              Cancelar
            </CButton>
            <CButton color="danger" onClick={confirmarEliminacionCurso} disabled={cargando}>
              {cargando ? 'Procesando...' : 'Sí, finalizar curso'}
            </CButton>
          </CModalFooter>
        </CModal>
      )}

      <SectionCard
        title={`Profesor: ${datos.length > 0 ? datos[0].profesor : inscripcionesPorProfesor?.message || 'Sin datos'}`}
        description={`Teléfono: ${datos.length > 0 ? datos[0].telefono_profesor : 'Sin datos'} | Total de estudiantes: ${totalEstudiantes}`}
      >
        {cargando ? (
          <LoadingState label="Cargando inscripciones…" />
        ) : datos.length === 0 ? (
          <EmptyState
            title="No hay inscripciones para este profesor"
            description="Selecciona otro profesor o revisa sus cursos asignados."
          />
        ) : (
          <>
            <div className="bm-report-course-list">
              <span>Cursos asignados: </span>
              {cursosUnicos.map((curso, index) => (
                <span className="bm-report-course-chip" key={`${curso}-${index}`}>
                  {curso}{' '}
                </span>
              ))}
            </div>
            <CTable
              align="middle"
              hover
              responsive
              className="bm-admin-table bm-teacher-report-table"
            >
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col" className="no-print">
                    Curso
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="no-print">
                    Nro
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col">fecha de Inscripcion</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Estudiante</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Teléfono</CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="no-print text-end">
                    Acciones
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {datos.map((dat, index) => {
                  const esPrimeroDelCurso = index === 0 || dat.curso !== datos[index - 1].curso

                  return (
                    <Fragment
                      key={
                        dat.id_inscripcion ||
                        `${dat.id_curso}-${dat.id_estudiante}-${dat.fecha_inscripcion}`
                      }
                    >
                      {esPrimeroDelCurso && (
                        <>
                          <CTableRow className="bm-report-group-row">
                            <CTableDataCell colSpan={5}>{dat.curso || 'Sin curso'}</CTableDataCell>
                            <CTableDataCell className="text-end">
                              <CButton
                                color="danger"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  eliminarInscripcionPorCurso(
                                    dat.id_curso,
                                    dat.curso,
                                    idProfesorSeleccionado,
                                  )
                                }
                              >
                                Finalizar curso
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        </>
                      )}
                      {dat.estudiante ? (
                        <CTableRow>
                          <CTableDataCell className="no-print"></CTableDataCell>
                          <CTableDataCell className="no-print text-body-secondary">
                            #{index + 1}
                          </CTableDataCell>
                          <CTableDataCell>
                            {dat.fecha_inscripcion
                              ? new Date(dat.fecha_inscripcion).toLocaleDateString()
                              : '---'}
                          </CTableDataCell>
                          <CTableDataCell>
                            <strong>{dat.estudiante}</strong>
                          </CTableDataCell>
                          <CTableDataCell>{dat.telefono_estudiante}</CTableDataCell>
                          <CTableDataCell className="no-print text-end">
                            <CButton
                              color="danger"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                eliminarInscripcionId(dat.id_inscripcion, idProfesorSeleccionado)
                              }
                            >
                              Eliminar
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ) : (
                        <CTableRow>
                          <CTableDataCell colSpan={6} className="bm-report-group-empty">
                            Sin inscripciones en este curso
                          </CTableDataCell>
                        </CTableRow>
                      )}
                    </Fragment>
                  )
                })}
              </CTableBody>
            </CTable>
          </>
        )}
      </SectionCard>
    </div>
  )
}
export default TablaProfesores
