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

const TablaInscripciones = ({ inscripciones, eliminarInscripcionId }) => {
  const filas = inscripciones || []

  return (
    <div className="reporte">
      <SectionCard
        title="Reporte de inscripciones"
        description={`Actualizado el ${new Date().toLocaleDateString()}`}
      >
        {filas.length === 0 ? (
          <div className="bm-table-empty">
            <strong>No hay inscripciones registradas</strong>
            <span>Las inscripciones aparecerán aquí cuando se registren.</span>
          </div>
        ) : (
          <CTable align="middle" hover responsive className="bm-admin-table bm-enrollment-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col" className="no-print">
                  ID
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">Inscripción</CTableHeaderCell>
                <CTableHeaderCell scope="col">Estudiante</CTableHeaderCell>
                <CTableHeaderCell scope="col">Curso</CTableHeaderCell>
                <CTableHeaderCell scope="col">Profesor</CTableHeaderCell>
                <CTableHeaderCell scope="col">Duración</CTableHeaderCell>
                <CTableHeaderCell scope="col">Costo</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="no-print text-end">
                  Acciones
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filas.map((ins, index) => (
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
                  <CTableDataCell>{ins.curso}</CTableDataCell>
                  <CTableDataCell>{ins.profesor}</CTableDataCell>
                  <CTableDataCell>
                    {ins.duracion?.hours
                      ? `${ins.duracion.hours} horas`
                      : ins.duracion?.days
                        ? `${ins.duracion.days} días`
                        : ins.duracion?.weeks
                          ? `${ins.duracion.weeks} semanas`
                          : ins.duracion?.months
                            ? `${ins.duracion.months} meses`
                            : 'N/A'}
                  </CTableDataCell>
                  <CTableDataCell>{ins.costo ? `Bs. ${ins.costo}` : 'Sin costo'}</CTableDataCell>
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

export default TablaInscripciones
