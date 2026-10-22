import {
  CNav,
  CNavItem,
  CNavLink,
  CButton,
  CButtonGroup,
  CCol,
  CFormInput,
  CFormSelect,
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
import CIcon from '@coreui/icons-react'
import { cilFilter, cilSearch } from '@coreui/icons'
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
  const [filtroAbierto, setFiltroAbierto] = useState(null)
  const [filtrosColumna, setFiltrosColumna] = useState({})
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
  const estadosDisponibles = [
    ...new Set(padresTutores.map((padreTutor) => padreTutor.estado || 'Sin estado')),
  ]
  const padresTutoresFiltrados = padresTutores.filter((padreTutor) => {
    const coincideBusquedaGlobal =
      normalizarTexto(obtenerNombreCompleto(padreTutor)).includes(normalizarTexto(searchTerm)) ||
      normalizarTexto(padreTutor.ci).includes(normalizarTexto(searchTerm)) ||
      normalizarTexto(padreTutor.telefono).includes(normalizarTexto(searchTerm)) ||
      normalizarTexto(padreTutor.direccion).includes(normalizarTexto(searchTerm))
    const coincideId = String(padreTutor.id_tutor ?? '').includes(filtrosColumna.id || '')
    const coincideNombre = normalizarTexto(obtenerNombreCompleto(padreTutor)).includes(
      normalizarTexto(filtrosColumna.nombre),
    )
    const coincideCi = normalizarTexto(padreTutor.ci).includes(normalizarTexto(filtrosColumna.ci))
    const coincideTelefono = normalizarTexto(padreTutor.telefono).includes(
      normalizarTexto(filtrosColumna.telefono),
    )
    const coincideDireccion = normalizarTexto(padreTutor.direccion).includes(
      normalizarTexto(filtrosColumna.direccion),
    )
    const coincideEstado =
      !filtrosColumna.estado ||
      normalizarTexto(padreTutor.estado || 'Sin estado') === normalizarTexto(filtrosColumna.estado)

    return (
      coincideBusquedaGlobal &&
      coincideId &&
      coincideNombre &&
      coincideCi &&
      coincideTelefono &&
      coincideDireccion &&
      coincideEstado
    )
  })
  const [pestañaActiva, setPestañaActiva] = useState('Activos')
  const padresTutoresVisibles = padresTutoresFiltrados.filter((padreTutor) =>
    pestañaActiva === 'Activos' ? padreTutor.estado === 'Activo' : padreTutor.estado === 'Inactivo',
  )

  const actualizarFiltroColumna = (columna, valor) => {
    setFiltrosColumna((filtrosActuales) => ({ ...filtrosActuales, [columna]: valor }))
  }

  const renderEncabezadoFiltrable = (titulo, columna, tipo = 'text') => (
    <CTableHeaderCell scope="col" className="table-tutor__head">
      <div className="table-tutor__heading">
        <span>{titulo}</span>
        <button
          type="button"
          className={`table-tutor__filter-toggle${filtrosColumna[columna] ? ' is-active' : ''}`}
          onClick={() => setFiltroAbierto(filtroAbierto === columna ? null : columna)}
          aria-label={`${filtroAbierto === columna ? 'Cerrar' : 'Abrir'} filtro de ${titulo}`}
          aria-expanded={filtroAbierto === columna}
          title={`Filtrar ${titulo}`}
        >
          <CIcon icon={tipo === 'select' ? cilFilter : cilSearch} />
        </button>
      </div>
      {filtroAbierto === columna && (
        <div className="table-tutor__filter-control">
          {tipo === 'select' ? (
            <CFormSelect
              value={filtrosColumna[columna] || ''}
              onChange={(event) => actualizarFiltroColumna(columna, event.target.value)}
              aria-label={`Filtrar por ${titulo}`}
              size="sm"
            >
              <option value="">Todos los estados</option>
              {estadosDisponibles.map((estado) => (
                <option key={estado} value={estado}>
                  {String(estado).charAt(0).toLocaleUpperCase() + String(estado).slice(1)}
                </option>
              ))}
            </CFormSelect>
          ) : (
            <CFormInput
              type={tipo}
              value={filtrosColumna[columna] || ''}
              onChange={(event) => actualizarFiltroColumna(columna, event.target.value)}
              aria-label={`Filtrar por ${titulo}`}
              placeholder={`Filtrar ${titulo.toLocaleLowerCase()}`}
              size="sm"
            />
          )}
        </div>
      )}
    </CTableHeaderCell>
  )

  return (
    <SectionCard
      title="Padres y tutores registrados"
      description={`${padresTutores.length} padre${padresTutores.length === 1 ? '' : 's'} o tutor${padresTutores.length === 1 ? '' : 'es'} en el sistema`}
    >
      <CRow className="mb-3 tutor-table__search-row">
        <CCol md={5} lg={4} className="ms-auto tutor-table__search-col">
          <CFormInput
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar padre..."
            aria-label="Buscar padre o tutor por nombre"
            className="tutor-search__input"
          />
        </CCol>
        <CCol xs="auto" className="d-flex justify-content-end">
          <CNav variant="tabs" className="tutor-table__nav-tabs">
            <CNavItem>
              <CNavLink
                active={pestañaActiva === 'Activos'}
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  setPestañaActiva(pestañaActiva === 'Activos' ? 'Inactivos' : 'Activos')
                }
                className={
                  pestañaActiva === 'Activos'
                    ? 'tutor-table__view-tab tutor-table__view-tab--active'
                    : 'tutor-table__view-tab tutor-table__view-tab--inactive'
                }
              >
                {pestañaActiva === 'Activos' ? '🔴 Dados de Baja' : '🟢 Activos'}
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCol>
      </CRow>
      {cargando ? (
        <LoadingState label="Cargando padres y tutores..." />
      ) : padresTutores.length === 0 ? (
        <EmptyState
          title="No hay padres o tutores registrados"
          description="Los registros que agregues aparecerán aquí."
        />
      ) : (
        <div className="table-responsive table-tutor__wrapper">
          <CTable align="middle" hover className="table-tutor__table">
            <CTableHead>
              <CTableRow>
                {renderEncabezadoFiltrable('ID', 'id', 'number')}
                {renderEncabezadoFiltrable('Nombre completo', 'nombre')}
                {renderEncabezadoFiltrable('CI', 'ci')}
                {renderEncabezadoFiltrable('Teléfono', 'telefono')}
                {renderEncabezadoFiltrable('Dirección', 'direccion')}
                {renderEncabezadoFiltrable('Estado', 'estado', 'select')}
                <CTableHeaderCell scope="col" className="table-tutor__head text-end">
                  Acciones
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {padresTutoresVisibles.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={7} className="table-tutor__empty-results">
                    No se encontraron coincidencias
                  </CTableDataCell>
                </CTableRow>
              ) : (
                padresTutoresVisibles.map((padreTutor) => (
                  <CTableRow key={padreTutor.id_tutor} className="table-tutor__row">
                    <CTableDataCell className="table-tutor__cell text-body-secondary">
                      #{padreTutor.id_tutor}
                    </CTableDataCell>
                    <CTableDataCell className="table-tutor__cell">
                      <strong>{obtenerNombreCompleto(padreTutor)}</strong>
                    </CTableDataCell>
                    <CTableDataCell className="table-tutor__cell">{padreTutor.ci}</CTableDataCell>
                    <CTableDataCell className="table-tutor__cell">
                      {padreTutor.telefono}
                    </CTableDataCell>
                    <CTableDataCell className="table-tutor__cell">
                      {padreTutor.direccion || 'Sin dirección'}
                    </CTableDataCell>
                    <CTableDataCell className="table-tutor__cell">
                      <StatusBadge status={padreTutor.estado || 'inactivo'}>
                        {padreTutor.estado || 'Sin estado'}
                      </StatusBadge>
                    </CTableDataCell>
                    <CTableDataCell className="table-tutor__cell text-end">
                      <CButtonGroup size="sm">
                        <CButton
                          color="primary"
                          variant="outline"
                          onClick={() => seleccionarPadreTutor(padreTutor)}
                          className="tutor-table__action"
                        >
                          Editar
                        </CButton>
                        <CButton
                          color="danger"
                          variant="outline"
                          onClick={() => eliminarPadreTutor(padreTutor.id_tutor)}
                          className="tutor-table__action"
                        >
                          {pestañaActiva === 'Activos' ? 'Eliminar' : 'Habilitar'}
                        </CButton>
                      </CButtonGroup>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </div>
      )}

      <CModal
        visible={Boolean(padreTutorParaEliminar)}
        onClose={cancelarEliminacion}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Eliminar padre o tutor</CModalTitle>
        </CModalHeader>
        <CModalBody>Esta acción cambiará el estado del padre/tutor. ¿Deseas continuar?</CModalBody>
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
              'Sí, actualizar'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </SectionCard>
  )
}

export default PadreTutorTable
