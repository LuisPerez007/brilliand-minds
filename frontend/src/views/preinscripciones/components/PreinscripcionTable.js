import '../../../scss/contenedorStyles/contenedores.scss'
import '../../../scss/textoStyles/textos.scss'
import '../../../scss/formaStyles/selectStyle.scss'
import '../../../scss/formaStyles/buttonStyle.scss'
import {
  CButton,
  CButtonGroup,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
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
import { SectionCard, LoadingState, EmptyState } from '../../../components'

const PreinscripcionTable = ({
  preinscripciones,
  rechazarSolicitud,
  aceptarSolicitud,
  solicitudEnProceso,
  cargando,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroAbierto, setFiltroAbierto] = useState(null)
  const [filtrosColumna, setFiltrosColumna] = useState({})
  const normalizarTexto = (texto) =>
    String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  const obtenerVarianteEstado = (estado) => {
    const estadoNormalizado = normalizarTexto(estado || 'pendiente')
    if (estadoNormalizado.includes('aprob')) return 'aprobada'
    if (estadoNormalizado.includes('rechaz')) return 'rechazada'
    if (estadoNormalizado.includes('pend')) return 'pendiente'
    return 'otro'
  }
  const estadosPreinscripcion = [
    ...new Set(preinscripciones.map((preIns) => preIns.estado || 'pendiente')),
  ]
  const preinscripcionesFiltradas = preinscripciones.filter((preIns) => {
    const coincideBusquedaGlobal =
      normalizarTexto(preIns.nombre).includes(normalizarTexto(searchTerm)) ||
      normalizarTexto(preIns.ci).includes(normalizarTexto(searchTerm)) ||
      normalizarTexto(preIns.colegio).includes(normalizarTexto(searchTerm)) ||
      normalizarTexto(preIns.direccion).includes(normalizarTexto(searchTerm)) ||
      normalizarTexto(preIns.telefono).includes(normalizarTexto(searchTerm)) ||
      normalizarTexto(preIns.email).includes(normalizarTexto(searchTerm))
    const coincideEstado =
      !filtrosColumna.estado ||
      normalizarTexto(preIns.estado || 'pendiente') === normalizarTexto(filtrosColumna.estado)
    const coincideFechaSolicitud =
      !filtrosColumna.solicitud ||
      (() => {
        const fecha = new Date(preIns.fecha_solicitud)
        if (Number.isNaN(fecha.getTime())) return false
        const anio = fecha.getFullYear()
        const mes = String(fecha.getMonth() + 1).padStart(2, '0')
        const dia = String(fecha.getDate()).padStart(2, '0')
        return `${anio}-${mes}-${dia}` === filtrosColumna.solicitud
      })()
    const coincideSolicitante = normalizarTexto(preIns.nombre).includes(
      normalizarTexto(filtrosColumna.solicitante),
    )
    const coincideCi = normalizarTexto(preIns.ci).includes(normalizarTexto(filtrosColumna.ci))
    const coincideColegio = normalizarTexto(preIns.colegio).includes(
      normalizarTexto(filtrosColumna.colegio),
    )
    const coincideDireccion = normalizarTexto(preIns.direccion).includes(
      normalizarTexto(filtrosColumna.direccion),
    )
    const coincideTelefono = normalizarTexto(preIns.telefono).includes(
      normalizarTexto(filtrosColumna.telefono),
    )
    const coincideEmail = normalizarTexto(preIns.email).includes(
      normalizarTexto(filtrosColumna.email),
    )

    return (
      coincideBusquedaGlobal &&
      coincideEstado &&
      coincideFechaSolicitud &&
      coincideSolicitante &&
      coincideCi &&
      coincideColegio &&
      coincideDireccion &&
      coincideTelefono &&
      coincideEmail
    )
  })

  const actualizarFiltroColumna = (columna, valor) => {
    setFiltrosColumna((filtrosActuales) => ({ ...filtrosActuales, [columna]: valor }))
  }

  const renderEncabezadoFiltrable = (titulo, columna, tipo = 'text') => (
    <CTableHeaderCell scope="col" className="table-preinscripcion__head-cell">
      <div className="table-preinscripcion__heading">
        <span>{titulo}</span>
        <button
          type="button"
          className={`table-preinscripcion__filter-toggle${filtrosColumna[columna] ? ' is-active' : ''}`}
          onClick={() => setFiltroAbierto(filtroAbierto === columna ? null : columna)}
          aria-label={`${filtroAbierto === columna ? 'Cerrar' : 'Abrir'} filtro de ${titulo}`}
          aria-expanded={filtroAbierto === columna}
          title={`Filtrar ${titulo}`}
        >
          <CIcon icon={tipo === 'select' ? cilFilter : cilSearch} />
        </button>
      </div>
      {filtroAbierto === columna && (
        <div className="table-preinscripcion__filter-control">
          {tipo === 'select' ? (
            <CFormSelect
              value={filtrosColumna[columna] || ''}
              onChange={(event) => actualizarFiltroColumna(columna, event.target.value)}
              aria-label={`Filtrar por ${titulo}`}
              size="sm"
            >
              <option value="">Todos los estados</option>
              {estadosPreinscripcion.map((estado) => (
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
      title="Solicitudes recibidas"
      description={`${preinscripciones.length} solicitud${preinscripciones.length === 1 ? '' : 'es'} registrada${preinscripciones.length === 1 ? '' : 's'}`}
      className="preinscripcion-table__card text-body"
    >
      <CRow className="mb-3 preinscripcion-search__row">
        <CCol md={5} lg={4} className="ms-auto preinscripcion-search__col">
          <CFormInput
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar solicitante..."
            aria-label="Buscar solicitante por nombre"
            className="preinscripcion-form__input preinscripcion-search__input"
          />
        </CCol>
      </CRow>
      {cargando ? (
        <LoadingState label="Cargando preinscripciones..." />
      ) : preinscripciones.length === 0 ? (
        <EmptyState
          title="No hay preinscripciones pendientes"
          description="Las nuevas solicitudes aparecerán aquí."
        />
      ) : (
        <div className="table-responsive preinscripcion-table__wrapper">
          <CTable align="middle" hover className="table-preinscripcion__table">
            <CTableHead className="table-preinscripcion__head">
              <CTableRow>
                {renderEncabezadoFiltrable('Estado', 'estado', 'select')}
                {renderEncabezadoFiltrable('Solicitante', 'solicitante')}
                {renderEncabezadoFiltrable('CI', 'ci')}
                {renderEncabezadoFiltrable('Colegio', 'colegio')}
                {renderEncabezadoFiltrable('Dirección', 'direccion')}
                {renderEncabezadoFiltrable('Teléfono', 'telefono')}
                {renderEncabezadoFiltrable('Email', 'email', 'search')}
                {renderEncabezadoFiltrable('Solicitud', 'solicitud', 'date')}
                <CTableHeaderCell scope="col" className="table-preinscripcion__head-cell text-end">
                  Acciones
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {preinscripcionesFiltradas.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={9} className="table-preinscripcion__empty-results">
                    No se encontraron coincidencias
                  </CTableDataCell>
                </CTableRow>
              ) : (
                preinscripcionesFiltradas.map((preIns) => (
                  <CTableRow key={preIns.id} className="table-preinscripcion__row">
                    <CTableDataCell className="table-preinscripcion__cell">
                      <span
                        className={`table-preinscripcion__status table-preinscripcion__status--${obtenerVarianteEstado(preIns.estado)}`}
                      >
                        {preIns.estado || 'Pendiente'}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell className="table-preinscripcion__cell">
                      <strong>{preIns.nombre}</strong>
                    </CTableDataCell>
                    <CTableDataCell className="table-preinscripcion__cell">
                      {preIns.ci}
                    </CTableDataCell>
                    <CTableDataCell className="table-preinscripcion__cell">
                      {preIns.colegio || 'Sin colegio'}
                    </CTableDataCell>
                    <CTableDataCell className="table-preinscripcion__cell bm-table-description">
                      {preIns.direccion}
                    </CTableDataCell>
                    <CTableDataCell className="table-preinscripcion__cell">
                      {preIns.telefono}
                    </CTableDataCell>
                    <CTableDataCell className="table-preinscripcion__cell bm-table-description">
                      {preIns.email}
                    </CTableDataCell>
                    <CTableDataCell className="table-preinscripcion__cell">
                      {new Date(preIns.fecha_solicitud).toLocaleDateString()}
                    </CTableDataCell>
                    <CTableDataCell className="table-preinscripcion__cell text-end">
                      <CButtonGroup size="sm">
                        <CButton
                          color="success"
                          disabled={Boolean(solicitudEnProceso)}
                          onClick={() => aceptarSolicitud(preIns.id)}
                          className="preinscripcion-table__action"
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
                          className="preinscripcion-table__action"
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
                ))
              )}
            </CTableBody>
          </CTable>
        </div>
      )}
    </SectionCard>
  )
}

export default PreinscripcionTable
