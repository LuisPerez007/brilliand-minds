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
import { EmptyState, LoadingState, SectionCard, StatusBadge } from '../../../components'

const PadreTutorTable = ({
  padresTutores,
  seleccionarPadreTutor,
  eliminarPadreTutor,
  padreTutorParaEliminar,
  cancelarEliminacion,
  confirmarEliminacion,
  accionEnProceso,
  cargando,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const obtenerNombreCompleto = (padreTutor) =>
    [
      padreTutor.nombre,
      padreTutor.apellidoPaterno ?? padreTutor.a_paterno,
      padreTutor.apellidoMaterno ?? padreTutor.a_materno,
    ]
      .filter(Boolean)
      .join(' ')
  const normalizarTexto = (texto) =>
    String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  const padresTutoresFiltrados = padresTutores.filter((padreTutor) =>
    normalizarTexto(obtenerNombreCompleto(padreTutor)).includes(normalizarTexto(searchTerm)),
  )

  return (
    <SectionCard
      title="Padres y tutores registrados"
      description={`${padresTutores.length} padre${padresTutores.length === 1 ? '' : 's'} o tutor${padresTutores.length === 1 ? '' : 'es'} en el sistema`}
    >
      <CRow className="mb-3">
        <CCol md={5} lg={4} className="ms-auto">
          <CFormInput
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar padre o tutor por nombre..."
            aria-label="Buscar padre o tutor por nombre"
          />
        </CCol>
      </CRow>
      {cargando ? (
        <LoadingState label="Cargando padres y tutores..." />
      ) : padresTutoresFiltrados.length === 0 ? (
        <EmptyState
          title={
            padresTutores.length === 0
              ? 'No hay padres o tutores registrados'
              : 'No se encontraron coincidencias'
          }
          description={
            padresTutores.length === 0
              ? 'Los registros que agregues aparecerán aquí.'
              : 'Prueba con otro nombre.'
          }
        />
      ) : (
        <CTable align="middle" hover responsive className="bm-admin-table">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Nombre completo</CTableHeaderCell>
              <CTableHeaderCell scope="col">CI</CTableHeaderCell>
              <CTableHeaderCell scope="col">Teléfono</CTableHeaderCell>
              <CTableHeaderCell scope="col">Dirección</CTableHeaderCell>
              <CTableHeaderCell scope="col" className="text-end">
                Acciones
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {padresTutoresFiltrados.map((padreTutor) => (
              <CTableRow key={padreTutor.id_tutor}>
                <CTableDataCell className="text-body-secondary">
                  #{padreTutor.id_tutor}
                </CTableDataCell>
                <CTableDataCell>
                  <strong>{obtenerNombreCompleto(padreTutor)}</strong>
                </CTableDataCell>
                <CTableDataCell>{padreTutor.ci}</CTableDataCell>
                <CTableDataCell>{padreTutor.telefono}</CTableDataCell>
                <CTableDataCell>{padreTutor.direccion || 'Sin dirección'}</CTableDataCell>
                <CTableDataCell className="text-end">
                  <CButtonGroup size="sm">
                    <CButton
                      color="primary"
                      variant="outline"
                      onClick={() => seleccionarPadreTutor(padreTutor)}
                    >
                      Editar
                    </CButton>
                    <CButton
                      color="danger"
                      variant="outline"
                      onClick={() => eliminarPadreTutor(padreTutor.id_tutor)}
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
        visible={Boolean(padreTutorParaEliminar)}
        onClose={cancelarEliminacion}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Eliminar padre o tutor</CModalTitle>
        </CModalHeader>
        <CModalBody>Esta acción eliminará el registro. ¿Deseas continuar?</CModalBody>
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

export default PadreTutorTable
