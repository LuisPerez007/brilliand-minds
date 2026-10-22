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
  ejecutarHabilitarUsuario,
  cargarProfesor,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroAbierto, setFiltroAbierto] = useState(null)
  const [filtrosColumna, setFiltrosColumna] = useState({})
  const obtenerNombreCompleto = (profe) =>
    [profe.nombre, profe.a_paterno, profe.a_materno].filter(Boolean).join(' ')
  const normalizarTexto = (texto) =>
    String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  const estadosProfesor = [...new Set(profesor.map((profe) => profe.estado || 'Sin estado'))]
  const profesoresFiltrados = profesor.filter((profe) => {
    const coincideBusquedaGlobal =
      normalizarTexto(obtenerNombreCompleto(profe)).includes(normalizarTexto(searchTerm)) ||
      normalizarTexto(profe.ci).includes(normalizarTexto(searchTerm)) ||
      normalizarTexto(profe.telefono).includes(normalizarTexto(searchTerm)) ||
      normalizarTexto(profe.email).includes(normalizarTexto(searchTerm)) ||
      normalizarTexto(profe.especialidad).includes(normalizarTexto(searchTerm))
    const coincideProfesor = normalizarTexto(obtenerNombreCompleto(profe)).includes(
      normalizarTexto(filtrosColumna.profesor),
    )
    const coincideCi = normalizarTexto(profe.ci).includes(normalizarTexto(filtrosColumna.ci))
    const coincideTelefono = normalizarTexto(profe.telefono).includes(
      normalizarTexto(filtrosColumna.telefono),
    )
    const coincideEmail = normalizarTexto(profe.email).includes(
      normalizarTexto(filtrosColumna.email),
    )
    const coincideEspecialidad = normalizarTexto(profe.especialidad).includes(
      normalizarTexto(filtrosColumna.especialidad),
    )
    const coincideRegistro =
      !filtrosColumna.registro ||
      (() => {
        const fecha = new Date(profe.fecha_registro)
        if (Number.isNaN(fecha.getTime())) return false
        const anio = fecha.getFullYear()
        const mes = String(fecha.getMonth() + 1).padStart(2, '0')
        const dia = String(fecha.getDate()).padStart(2, '0')
        return `${anio}-${mes}-${dia}` === filtrosColumna.registro
      })()
    const coincideEstado =
      !filtrosColumna.estado ||
      normalizarTexto(profe.estado || 'Sin estado') === normalizarTexto(filtrosColumna.estado)

    return (
      coincideBusquedaGlobal &&
      coincideProfesor &&
      coincideCi &&
      coincideTelefono &&
      coincideEmail &&
      coincideEspecialidad &&
      coincideRegistro &&
      coincideEstado
    )
  })

  const actualizarFiltroColumna = (columna, valor) => {
    setFiltrosColumna((filtrosActuales) => ({ ...filtrosActuales, [columna]: valor }))
  }

  const renderEncabezadoFiltrable = (titulo, columna, tipo = 'text') => (
    <CTableHeaderCell scope="col" className="table-profesor__head">
      <div className="table-profesor__heading">
        <span>{titulo}</span>
        <button
          type="button"
          className={`table-profesor__filter-toggle${filtrosColumna[columna] ? ' is-active' : ''}`}
          onClick={() => setFiltroAbierto(filtroAbierto === columna ? null : columna)}
          aria-label={`${filtroAbierto === columna ? 'Cerrar' : 'Abrir'} filtro de ${titulo}`}
          aria-expanded={filtroAbierto === columna}
          title={`Filtrar ${titulo}`}
        >
          <CIcon icon={tipo === 'select' ? cilFilter : cilSearch} />
        </button>
      </div>
      {filtroAbierto === columna && (
        <div className="table-profesor__filter-control">
          {tipo === 'select' ? (
            <CFormSelect
              value={filtrosColumna[columna] || ''}
              onChange={(event) => actualizarFiltroColumna(columna, event.target.value)}
              aria-label={`Filtrar por ${titulo}`}
              size="sm"
            >
              <option value="">Todos los estados</option>
              {estadosProfesor.map((estado) => (
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

  const [pestañaActiva, setPestañaActiva] = useState('Activos')
  const profesoresVisibles = profesoresFiltrados.filter((profe) =>
    pestañaActiva === 'Activos' ? profe.estado === 'Activo' : profe.estado === 'Inactivo',
  )

  return (
    <SectionCard
      title="Profesores registrados"
      description={`${profesor.length} profesor${profesor.length === 1 ? '' : 'es'} en el sistema`}
    >
      <CRow className="mb-3 profesor-table__search-row align-items-center">
        <CCol md={5} lg={4} className="ms-auto profesor-table__search-col">
          <CFormInput
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar profesor..."
            aria-label="Buscar profesor por nombre"
            className="profesor-search__input"
          />
        </CCol>
        <CCol xs="auto" className="d-flex justify-content-end">
          <CNav variant="tabs" className="profesor-table__nav-tabs">
            <CNavItem>
              <CNavLink
                active={pestañaActiva === 'Activos'}
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  setPestañaActiva(pestañaActiva === 'Activos' ? 'Inactivos' : 'Activos')
                }
                className={
                  pestañaActiva === 'Activos'
                    ? 'profesor-table__view-tab profesor-table__view-tab--active'
                    : 'profesor-table__view-tab profesor-table__view-tab--inactive'
                }
              >
                {pestañaActiva === 'Activos' ? '🔴 Dados de Baja' : '🟢 Activos'}
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCol>
      </CRow>

      {cargando ? (
        <LoadingState label="Cargando profesores..." />
      ) : profesor.length === 0 ? (
        <EmptyState
          title="No hay profesores registrados"
          description="Los profesores que agregues aparecerán aquí."
        />
      ) : (
        <div className="table-responsive table-profesor__wrapper">
          <CTable align="middle" hover className="table-profesor__table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col" className="table-profesor__head">
                  Nro
                </CTableHeaderCell>
                {renderEncabezadoFiltrable('Profesor', 'profesor')}
                {renderEncabezadoFiltrable('CI', 'ci')}
                {renderEncabezadoFiltrable('Teléfono', 'telefono')}
                {renderEncabezadoFiltrable('Email', 'email', 'search')}
                {renderEncabezadoFiltrable('Especialidad', 'especialidad')}
                {renderEncabezadoFiltrable('Registro', 'registro', 'date')}
                {renderEncabezadoFiltrable('Estado', 'estado', 'select')}
                <CTableHeaderCell scope="col" className="table-profesor__head text-end">
                  Acciones
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {profesoresVisibles.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={9} className="table-profesor__empty-results">
                    No se encontraron coincidencias
                  </CTableDataCell>
                </CTableRow>
              ) : (
                profesoresVisibles.map((profe, index) => (
                  <CTableRow key={profe.id_profesor} className="table-profesor__row">
                    <CTableDataCell className="table-profesor__cell text-body-secondary">
                      #{index + 1}
                    </CTableDataCell>
                    <CTableDataCell className="table-profesor__cell">
                      <strong>
                        {profe.nombre} {profe.a_paterno} {profe.a_materno}
                      </strong>
                    </CTableDataCell>
                    <CTableDataCell className="table-profesor__cell">{profe.ci}</CTableDataCell>
                    <CTableDataCell className="table-profesor__cell">
                      {profe.telefono}
                    </CTableDataCell>
                    <CTableDataCell className="table-profesor__cell">
                      {profe.email || 'Sin email'}
                    </CTableDataCell>
                    <CTableDataCell className="table-profesor__cell">
                      {profe.especialidad || 'Sin especialidad'}
                    </CTableDataCell>
                    <CTableDataCell className="table-profesor__cell">
                      {profe.fecha_registro
                        ? new Date(profe.fecha_registro).toLocaleDateString()
                        : '---'}
                    </CTableDataCell>
                    <CTableDataCell className="table-profesor__cell">
                      <StatusBadge status={profe.estado || 'inactivo'}>
                        {profe.estado || 'Sin estado'}
                      </StatusBadge>
                    </CTableDataCell>
                    <CTableDataCell className="table-profesor__cell text-end">
                      <CButtonGroup size="sm">
                        <CButton
                          color="primary"
                          variant="outline"
                          onClick={() => seleccionarProfesor(profe)}
                          className="profesor-table__action"
                        >
                          Editar
                        </CButton>
                        {pestañaActiva === 'Activos' ? (
                          <CButton
                            color="danger"
                            variant="outline"
                            onClick={() => eliminarProfesor(profe.id_profesor)}
                            className="profesor-table__action"
                          >
                            Eliminar
                          </CButton>
                        ) : (
                          <CButton
                            color="danger"
                            variant="outline"
                            onClick={async () => {
                              ejecutarHabilitarUsuario(profe.id_cuenta)
                              await cargarProfesor()
                            }}
                            className="profesor-table__action"
                          >
                            Habilitar
                          </CButton>
                        )}
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
