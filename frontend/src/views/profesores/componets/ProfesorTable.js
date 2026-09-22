import {
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
import { SectionCard, StatusBadge, LoadingState, EmptyState } from '../../../components'

const ProfesorTable = ({
  profesor,
  seleccionarProfesor,
  eliminarProfesor,
  profesorParaEliminar,
  cancelarEliminacion,
  confirmarEliminacion,
  accionEnProceso,
  cargando,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const obtenerNombreCompleto = (profe) =>
    [profe.nombre, profe.a_paterno, profe.a_materno].filter(Boolean).join(' ')
  const normalizarTexto = (texto) =>
    String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  const profesoresFiltrados = profesor.filter((profe) =>
    normalizarTexto(obtenerNombreCompleto(profe)).includes(normalizarTexto(searchTerm)),
  )

  return (
    <SectionCard
      title="Profesores registrados"
      description={`${profesor.length} profesor${profesor.length === 1 ? '' : 'es'} en el sistema`}
    >
      <CRow className="mb-3">
        <CCol md={5} lg={4} className="ms-auto">
          <CFormInput
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar profesor por nombre..."
            aria-label="Buscar profesor por nombre"
          />
        </CCol>
      </CRow>
      {cargando ? (
        <LoadingState label="Cargando profesores..." />
      ) : profesoresFiltrados.length === 0 ? (
        <EmptyState
          title={
            profesor.length === 0
              ? 'No hay profesores registrados'
              : 'No se encontraron coincidencias'
          }
          description={
            profesor.length === 0
              ? 'Los profesores que agregues aparecerán aquí.'
              : 'Prueba con otro nombre.'
          }
        />
      ) : (
        <CTable align="middle" hover responsive className="bm-admin-table bm-teacher-table">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Nro</CTableHeaderCell>
              <CTableHeaderCell scope="col">Profesor</CTableHeaderCell>
              <CTableHeaderCell scope="col">CI</CTableHeaderCell>
              <CTableHeaderCell scope="col">Teléfono</CTableHeaderCell>
              <CTableHeaderCell scope="col">Email</CTableHeaderCell>
              <CTableHeaderCell scope="col">Especialidad</CTableHeaderCell>
              <CTableHeaderCell scope="col">Registro</CTableHeaderCell>
              <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
              <CTableHeaderCell scope="col" className="text-end">
                Acciones
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {profesoresFiltrados.map((profe, index) => (
              <CTableRow key={profe.id_profesor}>
                <CTableDataCell className="text-body-secondary">#{index + 1}</CTableDataCell>
                <CTableDataCell>
                  <strong>
                    {profe.nombre} {profe.a_paterno} {profe.a_materno}
                  </strong>
                </CTableDataCell>
                <CTableDataCell>{profe.ci}</CTableDataCell>
                <CTableDataCell>{profe.telefono}</CTableDataCell>
                <CTableDataCell>{profe.email || 'Sin email'}</CTableDataCell>
                <CTableDataCell>{profe.especialidad || 'Sin especialidad'}</CTableDataCell>
                <CTableDataCell>
                  {profe.fecha_registro
                    ? new Date(profe.fecha_registro).toLocaleDateString()
                    : '---'}
                </CTableDataCell>
                <CTableDataCell>
                  <StatusBadge status={profe.estado || 'inactivo'}>
                    {profe.estado || 'Sin estado'}
                  </StatusBadge>
                </CTableDataCell>
                <CTableDataCell className="text-end">
                  <CButtonGroup size="sm">
                    <CButton
                      color="primary"
                      variant="outline"
                      onClick={() => seleccionarProfesor(profe)}
                    >
                      Editar
                    </CButton>
                    <CButton
                      color="danger"
                      variant="outline"
                      onClick={() => eliminarProfesor(profe.id_profesor)}
                    >
                      Eliminar
                    </CButton>
                  </CButtonGroup>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}
      <CModal
        visible={Boolean(profesorParaEliminar)}
        onClose={cancelarEliminacion}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Eliminar profesor</CModalTitle>
        </CModalHeader>
        <CModalBody>Esta acción eliminará el registro del profesor. ¿Deseas continuar?</CModalBody>
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

export default ProfesorTable
