import { useState } from 'react'
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { SectionCard } from '../../../components'

const normalizarTexto = (valor) =>
  String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

const TablaCursos = ({ inscripcionesPorCurso, eliminarInscripcionId }) => {
  const inscripciones = inscripcionesPorCurso?.data || []
  const mensaje = inscripcionesPorCurso?.message
  const [filtroAbierto, setFiltroAbierto] = useState(null)
  const [filtrosColumna, setFiltrosColumna] = useState({
    inscripcion: '',
    estudiante: '',
    telefono: '',
  })
  const tieneDatosOriginales = inscripciones.length > 0

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

  const inscripcionesFiltradas = inscripciones.filter((ins) => {
    const cumpleInscripcion =
      !filtrosColumna.inscripcion ||
      new Date(ins.fecha_inscripcion).toISOString().slice(0, 10) === filtrosColumna.inscripcion

    const cumpleEstudiante =
      !filtrosColumna.estudiante ||
      normalizarTexto(ins.estudiante).includes(normalizarTexto(filtrosColumna.estudiante))

    const cumpleTelefono =
      !filtrosColumna.telefono ||
      normalizarTexto(ins.telefono_estudiante).includes(normalizarTexto(filtrosColumna.telefono))

    return cumpleInscripcion && cumpleEstudiante && cumpleTelefono
  })

  return (
    <div className="inscripcion-reporte__wrapper">
      <SectionCard
        title={`Curso: ${inscripciones?.[0]?.curso || mensaje || 'Sin datos'}`}
        description={`Profesor: ${inscripciones?.[0]?.profesor || 'Sin asignar'} | Teléfono: ${inscripciones?.[0]?.telefono_profesor || 'Sin datos'} | Total de estudiantes: ${inscripcionesPorCurso?.total_estudiantes ?? 0}`}
        className="inscripcion-table__card text-body"
      >
        {!tieneDatosOriginales ? (
          <div className="bm-table-empty inscripcion-table__empty">
            <strong>No hay estudiantes inscritos</strong>
            <span>El curso todavía no tiene inscripciones registradas.</span>
          </div>
        ) : (
          <div className="table-responsive inscripcion-table__wrapper">
            <CTable align="middle" hover className="table-inscripcion__table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col" className="no-print table-inscripcion__head-cell">
                    ID inscripción
                  </CTableHeaderCell>
                  {renderFilterHeader('inscripcion', 'Inscripción', 'date')}
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
                {inscripcionesFiltradas.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={5} className="table-inscripcion__empty-results">
                      No se encontraron resultados
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  inscripcionesFiltradas.map((ins, index) => (
                    <CTableRow key={ins.id_inscripcion} className="table-inscripcion__row">
                      <CTableDataCell className="no-print text-body-secondary table-inscripcion__cell">
                        #{index + 1}
                      </CTableDataCell>
                      <CTableDataCell className="table-inscripcion__cell">
                        {new Date(ins.fecha_inscripcion).toLocaleDateString()}
                      </CTableDataCell>
                      <CTableDataCell className="table-inscripcion__cell">
                        <strong>{ins.estudiante}</strong>
                      </CTableDataCell>
                      <CTableDataCell className="table-inscripcion__cell">
                        {ins.telefono_estudiante}
                      </CTableDataCell>
                      <CTableDataCell className="no-print text-end table-inscripcion__cell">
                        <CButton
                          color="danger"
                          variant="outline"
                          size="sm"
                          onClick={() => eliminarInscripcionId(ins.id_inscripcion)}
                          className="inscripcion-action__button"
                        >
                          Eliminar
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        )}
      </SectionCard>
    </div>
  )
}

export default TablaCursos
