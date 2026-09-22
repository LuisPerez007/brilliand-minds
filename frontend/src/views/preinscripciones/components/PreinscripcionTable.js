import '../../../scss/contenedorStyles/contenedores.scss'
import '../../../scss/textoStyles/textos.scss'
import '../../../scss/formaStyles/selectStyle.scss'
import '../../../scss/formaStyles/buttonStyle.scss'
import {
  CButton,
  CButtonGroup,
  CCol,
  CFormInput,
  CRow,
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

const PreinscripcionTable = ({
  preinscripciones,
  rechazarSolicitud,
  aceptarSolicitud,
  solicitudEnProceso,
  cargando,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const normalizarTexto = (texto) =>
    String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  const preinscripcionesFiltradas = preinscripciones.filter((preIns) =>
    normalizarTexto(preIns.nombre).includes(normalizarTexto(searchTerm)),
  )

  return (
    <SectionCard
      title="Solicitudes recibidas"
      description={`${preinscripciones.length} solicitud${preinscripciones.length === 1 ? '' : 'es'} registrada${preinscripciones.length === 1 ? '' : 's'}`}
    >
      <CRow className="mb-3">
        <CCol md={5} lg={4} className="ms-auto">
          <CFormInput
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar solicitante por nombre..."
            aria-label="Buscar solicitante por nombre"
          />
        </CCol>
      </CRow>
      {cargando ? (
        <LoadingState label="Cargando preinscripciones..." />
      ) : preinscripcionesFiltradas.length === 0 ? (
        <EmptyState
          title={
            preinscripciones.length === 0
              ? 'No hay preinscripciones pendientes'
              : 'No se encontraron coincidencias'
          }
          description={
            preinscripciones.length === 0
              ? 'Las nuevas solicitudes aparecerán aquí.'
              : 'Prueba con otro nombre.'
          }
        />
      ) : (
        <CTable align="middle" hover responsive className="bm-admin-table bm-preinscription-table">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
              <CTableHeaderCell scope="col">Solicitante</CTableHeaderCell>
              <CTableHeaderCell scope="col">CI</CTableHeaderCell>
              <CTableHeaderCell scope="col">Colegio</CTableHeaderCell>
              <CTableHeaderCell scope="col">Dirección</CTableHeaderCell>
              <CTableHeaderCell scope="col">Teléfono</CTableHeaderCell>
              <CTableHeaderCell scope="col">Email</CTableHeaderCell>
              <CTableHeaderCell scope="col">Solicitud</CTableHeaderCell>
              <CTableHeaderCell scope="col" className="text-end">
                Acciones
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {preinscripcionesFiltradas.map((preIns) => (
              <CTableRow key={preIns.id}>
                <CTableDataCell>
                  <StatusBadge status={preIns.estado || 'pendiente'}>
                    {preIns.estado || 'Pendiente'}
                  </StatusBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <strong>{preIns.nombre}</strong>
                </CTableDataCell>
                <CTableDataCell>{preIns.ci}</CTableDataCell>
                <CTableDataCell>{preIns.colegio || 'Sin colegio'}</CTableDataCell>
                <CTableDataCell className="bm-table-description">{preIns.direccion}</CTableDataCell>
                <CTableDataCell>{preIns.telefono}</CTableDataCell>
                <CTableDataCell className="bm-table-description">{preIns.email}</CTableDataCell>
                <CTableDataCell>
                  {new Date(preIns.fecha_solicitud).toLocaleDateString()}
                </CTableDataCell>
                <CTableDataCell className="text-end">
                  <CButtonGroup size="sm">
                    <CButton
                      color="success"
                      disabled={Boolean(solicitudEnProceso)}
                      onClick={() => aceptarSolicitud(preIns.id)}
                    >
                      {solicitudEnProceso?.id === preIns.id &&
                      solicitudEnProceso.tipo === 'aprobar' ? (
                        <>
                          <CSpinner size="sm" className="me-1" /> Procesando
                        </>
                      ) : (
                        'Aprobar'
                      )}
                    </CButton>
                    <CButton
                      color="danger"
                      variant="outline"
                      disabled={Boolean(solicitudEnProceso)}
                      onClick={() => rechazarSolicitud(preIns.id)}
                    >
                      {solicitudEnProceso?.id === preIns.id &&
                      solicitudEnProceso.tipo === 'rechazar' ? (
                        <>
                          <CSpinner size="sm" className="me-1" /> Procesando
                        </>
                      ) : (
                        'Rechazar'
                      )}
                    </CButton>
                  </CButtonGroup>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}
    </SectionCard>
  )
}

export default PreinscripcionTable
