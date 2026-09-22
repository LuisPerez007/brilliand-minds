import {
  CAlert,
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
import { SectionCard, StatusBadge } from '../../../../components'

const TableControlPagosEstudiante = ({
  listaEstudiantesNoPagados,
  padresTutores,
  estudiantes,
  marcarInscripcionComoPagada,
  pagoEnProceso,
}) => {
  const pagosPendientes = listaEstudiantesNoPagados ?? []
  const [tutorSeleccionado, setTutorSeleccionado] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const normalizarTexto = (texto) =>
    String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  const pagosFiltrados = pagosPendientes.filter((pago) =>
    normalizarTexto(pago.estudiante).includes(normalizarTexto(searchTerm)),
  )

  const obtenerTutor = (estudiante) => {
    const tutorIncluido = estudiante.tutor || estudiante.padreTutor || estudiante.padre_tutor
    if (tutorIncluido) return tutorIncluido

    const estudianteRegistrado = estudiantes.find(
      (item) => String(item.id_estudiante) === String(estudiante.id_estudiante),
    )
    const idTutor =
      estudiante.idTutor ||
      estudiante.id_tutor ||
      estudianteRegistrado?.idTutor ||
      estudianteRegistrado?.id_tutor
    return padresTutores.find(
      (padreTutor) => String(padreTutor.id_tutor || padreTutor.idTutor) === String(idTutor),
    )
  }

  const abrirTutor = (estudiante) => {
    setTutorSeleccionado(obtenerTutor(estudiante) || { noAsignado: true })
  }

  return (
    <SectionCard
      title="Pagos pendientes"
      description={`${pagosPendientes.length} inscripción${pagosPendientes.length === 1 ? '' : 'es'} pendiente${pagosPendientes.length === 1 ? '' : 's'}`}
    >
      <CRow className="mb-3">
        <CCol md={5} lg={4} className="ms-auto">
          <CFormInput
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar estudiante por nombre..."
            aria-label="Buscar estudiante por nombre"
          />
        </CCol>
      </CRow>
      {pagosFiltrados.length === 0 ? (
        <div className="bm-table-empty">
          <strong>
            {pagosPendientes.length === 0
              ? 'No hay pagos pendientes'
              : 'No se encontraron coincidencias'}
          </strong>
          <span>
            {pagosPendientes.length === 0
              ? 'Las inscripciones pendientes de pago aparecerán aquí.'
              : 'Prueba con otro nombre.'}
          </span>
        </div>
      ) : (
        <CTable align="middle" hover responsive className="bm-admin-table bm-payment-table">
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell scope="col">Inscripción</CTableHeaderCell>
              <CTableHeaderCell scope="col">Estudiante</CTableHeaderCell>
              <CTableHeaderCell scope="col">CI</CTableHeaderCell>
              <CTableHeaderCell scope="col">Dirección</CTableHeaderCell>
              <CTableHeaderCell scope="col">Teléfono</CTableHeaderCell>
              <CTableHeaderCell scope="col">Curso</CTableHeaderCell>
              <CTableHeaderCell scope="col">Costo</CTableHeaderCell>
              <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
              <CTableHeaderCell scope="col" className="text-end">
                Acciones
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {pagosFiltrados.map((noPagado) => (
              <CTableRow key={noPagado.id_inscripcion}>
                <CTableDataCell>
                  {new Date(noPagado.fecha_inscripcion).toLocaleDateString()}
                </CTableDataCell>

                <CTableDataCell>
                  <strong>{noPagado.estudiante}</strong>
                </CTableDataCell>

                <CTableDataCell>{noPagado.ci}</CTableDataCell>

                <CTableDataCell className="bm-table-description">
                  {noPagado.direccion}
                </CTableDataCell>

                <CTableDataCell>{noPagado.telefono}</CTableDataCell>

                <CTableDataCell>{noPagado.curso || noPagado.materia}</CTableDataCell>

                <CTableDataCell>Bs. {noPagado.costo}</CTableDataCell>

                <CTableDataCell>
                  <StatusBadge status={noPagado.estado_pago || 'pendiente'}>
                    {noPagado.estado_pago || 'Pendiente'}
                  </StatusBadge>
                </CTableDataCell>

                <CTableDataCell className="text-end">
                  <CButtonGroup size="sm">
                    <CButton
                      color="info"
                      variant="outline"
                      onClick={() => abrirTutor(noPagado)}
                      disabled={Boolean(pagoEnProceso)}
                    >
                      Ver tutor
                    </CButton>
                    <CButton
                      color="success"
                      disabled={Boolean(pagoEnProceso)}
                      onClick={() => marcarInscripcionComoPagada(noPagado, obtenerTutor(noPagado))}
                    >
                      {pagoEnProceso === noPagado.id_inscripcion ? (
                        <>
                          <CSpinner size="sm" className="me-1" /> Procesando
                        </>
                      ) : (
                        'Pagar'
                      )}
                    </CButton>
                  </CButtonGroup>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}
      <CModal
        visible={Boolean(tutorSeleccionado)}
        onClose={() => setTutorSeleccionado(null)}
        alignment="center"
      >
        <CModalHeader closeButton>
          <CModalTitle>Datos del padre o tutor</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {tutorSeleccionado?.noAsignado ? (
            <CAlert color="warning" className="mb-0">
              Este estudiante no tiene un padre o tutor asignado.
            </CAlert>
          ) : (
            <dl className="row mb-0">
              <dt className="col-sm-4">Nombre completo</dt>
              <dd className="col-sm-8">
                {[
                  tutorSeleccionado?.nombre,
                  tutorSeleccionado?.apellidoPaterno || tutorSeleccionado?.a_paterno,
                  tutorSeleccionado?.apellidoMaterno || tutorSeleccionado?.a_materno,
                ]
                  .filter(Boolean)
                  .join(' ') || 'Sin información'}
              </dd>
              <dt className="col-sm-4">CI</dt>
              <dd className="col-sm-8">{tutorSeleccionado?.ci || 'Sin información'}</dd>
              <dt className="col-sm-4">Teléfono</dt>
              <dd className="col-sm-8">{tutorSeleccionado?.telefono || 'Sin información'}</dd>
              <dt className="col-sm-4">Dirección</dt>
              <dd className="col-sm-8">{tutorSeleccionado?.direccion || 'Sin información'}</dd>
            </dl>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={() => setTutorSeleccionado(null)}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>
    </SectionCard>
  )
}

export default TableControlPagosEstudiante
