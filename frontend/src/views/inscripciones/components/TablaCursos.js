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

const TablaCursos = ({ inscripcionesPorCurso, eliminarInscripcionId }) => {
  const inscripciones = inscripcionesPorCurso?.data || []
  const mensaje = inscripcionesPorCurso?.message

  return (
    <div className="reporte">
      <SectionCard
        title={`Curso: ${inscripciones?.[0]?.curso || mensaje || 'Sin datos'}`}
        description={`Profesor: ${inscripciones?.[0]?.profesor || 'Sin asignar'} | Teléfono: ${inscripciones?.[0]?.telefono_profesor || 'Sin datos'} | Total de estudiantes: ${inscripcionesPorCurso?.total_estudiantes ?? 0}`}
      >
        {inscripciones.length === 0 ? (
          <div className="bm-table-empty">
            <strong>No hay estudiantes inscritos</strong>
            <span>El curso todavía no tiene inscripciones registradas.</span>
          </div>
        ) : (
          <CTable align="middle" hover responsive className="bm-admin-table bm-course-report-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col" className="no-print">
                  ID inscripción
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">Inscripción</CTableHeaderCell>
                <CTableHeaderCell scope="col">Estudiante</CTableHeaderCell>
                <CTableHeaderCell scope="col">Teléfono</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="no-print text-end">
                  Acciones
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {inscripciones.map((ins, index) => (
                <CTableRow key={ins.id_inscripcion}>
                  <CTableDataCell className="no-print text-body-secondary">
                    #{index + 1}
                  </CTableDataCell>
                  <CTableDataCell>
                    {new Date(ins.fecha_inscripcion).toLocaleDateString()}
                  </CTableDataCell>
                  <CTableDataCell>
                    <strong>{ins.estudiante}</strong>
                  </CTableDataCell>
                  <CTableDataCell>{ins.telefono_estudiante}</CTableDataCell>
                  <CTableDataCell className="no-print text-end">
                    <CButton
                      color="danger"
                      variant="outline"
                      size="sm"
                      onClick={() => eliminarInscripcionId(ins.id_inscripcion)}
                    >
                      Eliminar
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </SectionCard>
    </div>
  )
}

export default TablaCursos
