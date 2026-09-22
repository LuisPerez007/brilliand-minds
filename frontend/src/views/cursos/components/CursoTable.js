import {
  CBadge,
  CButton,
  CButtonGroup,
  CCol,
  CFormInput,
  CRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useState } from 'react'
import { SectionCard } from '../../../components'

const CursoTable = ({
  cursos,
  seleccionarCurso,
  eliminarCurso,
  cursoParaEliminar,
  cancelarEliminacion,
  confirmarEliminacion,
  accionEnProceso,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const normalizarTexto = (texto) =>
    String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  const cursosFiltrados = cursos.filter((curso) =>
    normalizarTexto(curso.nombre).includes(normalizarTexto(searchTerm)),
  )

  return (
    <SectionCard
      title="Cursos registrados"
      description={`${cursos.length} curso${cursos.length === 1 ? '' : 's'} en el sistema`}
    >
      <CRow className="mb-3">
        <CCol md={5} lg={4} className="ms-auto">
          <CFormInput
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar curso por nombre..."
            aria-label="Buscar curso por nombre"
          />
        </CCol>
      </CRow>
      {cursosFiltrados.length === 0 ? (
        <div className="bm-table-empty">
          <strong>
            {cursos.length === 0 ? 'No hay cursos registrados' : 'No se encontraron coincidencias'}
          </strong>
          <span>
            {cursos.length === 0
              ? 'Los cursos que agregues aparecerán aquí.'
              : 'Prueba con otro nombre.'}
          </span>
        </div>
      ) : (
        <CTable align="middle" hover responsive className="bm-admin-table bm-course-table">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Nro</CTableHeaderCell>
              <CTableHeaderCell scope="col">Curso</CTableHeaderCell>
              <CTableHeaderCell scope="col">Profesor</CTableHeaderCell>
              <CTableHeaderCell scope="col">Descripción</CTableHeaderCell>
              <CTableHeaderCell scope="col">Duración</CTableHeaderCell>
              <CTableHeaderCell scope="col">Precio</CTableHeaderCell>
              <CTableHeaderCell scope="col">Cupos</CTableHeaderCell>
              <CTableHeaderCell scope="col">Inicio</CTableHeaderCell>
              <CTableHeaderCell scope="col">Fin</CTableHeaderCell>
              <CTableHeaderCell scope="col" className="text-end">
                Acciones
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {cursosFiltrados.map((curs, index) => {
              const unidad =
                curs.duracion && typeof curs.duracion === 'object'
                  ? Object.keys(curs.duracion)[0]
                  : null
              const valor = unidad ? curs.duracion[unidad] : null
              const unidades = {
                days: 'días',
                hours: 'horas',
                months: 'meses',
                weeks: 'semanas',
              }

              return (
                <CTableRow key={curs.id_curso}>
                  <CTableDataCell className="text-body-secondary">#{index + 1}</CTableDataCell>
                  <CTableDataCell>
                    <strong>{curs.nombre}</strong>
                  </CTableDataCell>
                  <CTableDataCell>
                    {curs.profesor_nombre ? (
                      curs.profesor_nombre
                    ) : (
                      <CBadge color="warning">Sin asignar</CBadge>
                    )}
                  </CTableDataCell>
                  <CTableDataCell className="bm-table-description">
                    {curs.descripcion || 'Sin descripción'}
                  </CTableDataCell>
                  <CTableDataCell>
                    {valor ? `${valor} ${unidades[unidad] || unidad}` : 'Sin duración'}
                  </CTableDataCell>
                  <CTableDataCell>{curs.costo ? `Bs. ${curs.costo}` : 'Sin precio'}</CTableDataCell>
                  <CTableDataCell>{curs.cupo_total ?? '---'}</CTableDataCell>
                  <CTableDataCell>
                    {curs.fecha_creacion
                      ? new Date(curs.fecha_creacion).toLocaleDateString()
                      : '---'}
                  </CTableDataCell>
                  <CTableDataCell>
                    {curs.fecha_fin ? new Date(curs.fecha_fin).toLocaleDateString() : '---'}
                  </CTableDataCell>
                  <CTableDataCell className="text-end">
                    <CButtonGroup size="sm">
                      <CButton
                        color="primary"
                        variant="outline"
                        onClick={() => seleccionarCurso(curs)}
                      >
                        Editar
                      </CButton>
                      <CButton
                        color="danger"
                        variant="outline"
                        onClick={() => eliminarCurso(curs.id_curso)}
                      >
                        Eliminar
                      </CButton>
                    </CButtonGroup>
                  </CTableDataCell>
                </CTableRow>
              )
            })}
          </CTableBody>
        </CTable>
      )}
      <CModal
        visible={Boolean(cursoParaEliminar)}
        onClose={cancelarEliminacion}
        portal={false}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Eliminar curso</CModalTitle>
        </CModalHeader>
        <CModalBody>Esta acción eliminará el curso seleccionado. ¿Deseas continuar?</CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            variant="outline"
            onClick={cancelarEliminacion}
            disabled={Boolean(accionEnProceso)}
          >
            Cancelar
          </CButton>
          <CButton
            color="danger"
            onClick={confirmarEliminacion}
            disabled={Boolean(accionEnProceso)}
          >
            {accionEnProceso === 'eliminar' ? (
              <>
                <CSpinner size="sm" className="me-1" /> Procesando
              </>
            ) : (
              'Sí, eliminar'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </SectionCard>
  )
}

export default CursoTable
