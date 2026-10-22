import { Fragment, useState } from 'react'
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

const normalizarTexto = (valor) =>
  String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

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
  const tieneDatosOriginales = datos.length > 0
  const [filtroAbierto, setFiltroAbierto] = useState(null)
  const [filtrosColumna, setFiltrosColumna] = useState({
    curso: '',
    fecha_inscripcion: '',
    estudiante: '',
    telefono: '',
  })

  const renderFilterHeader = (campo, etiqueta, tipo = 'text') => {
    const isOpen = filtroAbierto === campo
    const valorActual = filtrosColumna[campo] || ''

    return (
      <CTableHeaderCell scope="col" className="table-inscripcion__head-cell">
        <div className="table-inscripcion__header">
          <span>{etiqueta}</span>
          <button
            type="button"
            className={`table-inscripcion__filter-toggle ${isOpen ? 'is-open' : ''}`}
            onClick={() => setFiltroAbierto(isOpen ? null : campo)}
            aria-label={`Filtrar por ${etiqueta}`}
          >
            {tipo === 'date' ? '🔽' : '🔍'}
          </button>
        </div>
        {isOpen && (
          <div className="table-inscripcion__filter-panel">
            {tipo === 'date' ? (
              <input
                type="date"
                className="table-inscripcion__filter-input"
                value={valorActual}
                onChange={(event) =>
                  setFiltrosColumna((prev) => ({ ...prev, [campo]: event.target.value }))
                }
              />
            ) : (
              <input
                type="text"
                className="table-inscripcion__filter-input"
                value={valorActual}
                placeholder="Buscar"
                onChange={(event) =>
                  setFiltrosColumna((prev) => ({ ...prev, [campo]: event.target.value }))
                }
              />
            )}
          </div>
        )}
      </CTableHeaderCell>
    )
  }

  const datosFiltrados = datos.filter((dat) => {
    const cumpleCurso =
      !filtrosColumna.curso ||
      normalizarTexto(dat.curso || 'Sin curso').includes(normalizarTexto(filtrosColumna.curso))

    const cumpleFecha =
      !filtrosColumna.fecha_inscripcion ||
      (dat.fecha_inscripcion &&
        new Date(dat.fecha_inscripcion).toISOString().slice(0, 10) ===
          filtrosColumna.fecha_inscripcion)

    const cumpleEstudiante =
      !filtrosColumna.estudiante ||
      normalizarTexto(dat.estudiante || '').includes(normalizarTexto(filtrosColumna.estudiante))

    const cumpleTelefono =
      !filtrosColumna.telefono ||
      normalizarTexto(dat.telefono_estudiante || '').includes(
        normalizarTexto(filtrosColumna.telefono),
      )

    return cumpleCurso && cumpleFecha && cumpleEstudiante && cumpleTelefono
  })

  return (
    <div className="inscripcion-reporte__wrapper">
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
        className="inscripcion-table__card text-body"
      >
        {cargando ? (
          <LoadingState label="Cargando inscripciones…" />
        ) : !tieneDatosOriginales ? (
          <EmptyState
            title="No hay inscripciones para este profesor"
            description="Selecciona otro profesor o revisa sus cursos asignados."
          />
        ) : (
          <>
            <div className="inscripcion-course-list__chips">
              <span>Cursos asignados: </span>
              {cursosUnicos.map((curso, index) => (
                <span className="inscripcion-course-list__chip" key={`${curso}-${index}`}>
                  {curso}{' '}
                </span>
              ))}
            </div>
            <div className="table-responsive inscripcion-table__wrapper">
              <CTable align="middle" hover className="table-inscripcion__table">
                <CTableHead>
                  <CTableRow>
                    {renderFilterHeader('curso', 'Curso')}
                    <CTableHeaderCell scope="col" className="no-print table-inscripcion__head-cell">
                      Nro
                    </CTableHeaderCell>
                    {renderFilterHeader('fecha_inscripcion', 'Fecha de Inscripcion', 'date')}
                    {renderFilterHeader('estudiante', 'Estudiante')}
                    {renderFilterHeader('telefono', 'Teléfono')}
                    <CTableHeaderCell
                      scope="col"
                      className="no-print text-end table-inscripcion__head-cell"
                    >
                      Acciones
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {datosFiltrados.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan={6} className="table-inscripcion__empty-results">
                        No se encontraron resultados
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    datosFiltrados.map((dat, index) => {
                      const esPrimeroDelCurso =
                        index === 0 || dat.curso !== datosFiltrados[index - 1].curso

                      return (
                        <Fragment
                          key={
                            dat.id_inscripcion ||
                            `${dat.id_curso}-${dat.id_estudiante}-${dat.fecha_inscripcion}`
                          }
                        >
                          {esPrimeroDelCurso && (
                            <>
                              <CTableRow className="table-inscripcion__group-row">
                                <CTableDataCell
                                  colSpan={5}
                                  className="table-inscripcion__group-cell"
                                >
                                  {dat.curso || 'Sin curso'}
                                </CTableDataCell>
                                <CTableDataCell className="text-end table-inscripcion__group-cell">
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
                                    className="inscripcion-action__button"
                                  >
                                    Finalizar curso
                                  </CButton>
                                </CTableDataCell>
                              </CTableRow>
                            </>
                          )}
                          {dat.estudiante ? (
                            <CTableRow className="table-inscripcion__row">
                              <CTableDataCell className="no-print table-inscripcion__cell"></CTableDataCell>
                              <CTableDataCell className="no-print text-body-secondary table-inscripcion__cell">
                                #{index + 1}
                              </CTableDataCell>
                              <CTableDataCell className="table-inscripcion__cell">
                                {dat.fecha_inscripcion
                                  ? new Date(dat.fecha_inscripcion).toLocaleDateString()
                                  : '---'}
                              </CTableDataCell>
                              <CTableDataCell className="table-inscripcion__cell">
                                <strong>{dat.estudiante}</strong>
                              </CTableDataCell>
                              <CTableDataCell className="table-inscripcion__cell">
                                {dat.telefono_estudiante}
                              </CTableDataCell>
                              <CTableDataCell className="no-print text-end table-inscripcion__cell">
                                <CButton
                                  color="danger"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    eliminarInscripcionId(
                                      dat.id_inscripcion,
                                      idProfesorSeleccionado,
                                    )
                                  }
                                  className="inscripcion-action__button"
                                >
                                  Eliminar
                                </CButton>
                              </CTableDataCell>
                            </CTableRow>
                          ) : (
                            <CTableRow>
                              <CTableDataCell
                                colSpan={6}
                                className="bm-report-group-empty table-inscripcion__cell"
                              >
                                Sin inscripciones en este curso
                              </CTableDataCell>
                            </CTableRow>
                          )}
                        </Fragment>
                      )
                    })
                  )}
                </CTableBody>
              </CTable>
            </div>
          </>
        )}
      </SectionCard>
    </div>
  )
}
export default TablaProfesores
