import {
  CNav,
  CNavItem,
  CNavLink,
  CBadge,
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
import { SectionCard, StatusBadge } from '../../../components'

const CursoTable = ({
  cursos,
  seleccionarCurso,
  eliminarCurso,
  cursoParaEliminar,
  cancelarEliminacion,
  confirmarEliminacion,
  accionEnProceso,
  cargarCursos,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroAbierto, setFiltroAbierto] = useState(null)
  const [filtrosColumna, setFiltrosColumna] = useState({})
  const normalizarTexto = (texto) =>
    String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  const profesoresDisponibles = [
    ...new Set(cursos.map((curso) => curso.profesor_nombre || 'Sin asignar')),
  ]
  const estadosCurso = [...new Set(cursos.map((curso) => curso.estado || 'Sin estado'))]
  const obtenerDuracionTexto = (curso) => {
    const unidad =
      curso.duracion && typeof curso.duracion === 'object' ? Object.keys(curso.duracion)[0] : null
    const valor = unidad ? curso.duracion[unidad] : null
    const unidades = {
      days: 'días',
      hours: 'horas',
      months: 'meses',
      weeks: 'semanas',
    }
    return valor ? `${valor} ${unidades[unidad] || unidad}` : 'Sin duración'
  }
  const coincideFecha = (valor, filtro) => {
    if (!filtro) return true
    const fecha = new Date(valor)
    if (Number.isNaN(fecha.getTime())) return false
    const anio = fecha.getFullYear()
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const dia = String(fecha.getDate()).padStart(2, '0')
    return `${anio}-${mes}-${dia}` === filtro
  }
  const cursosFiltrados = cursos.filter((curso) => {
    const coincideBusquedaGlobal =
      normalizarTexto(curso.nombre).includes(normalizarTexto(searchTerm)) ||
      normalizarTexto(curso.profesor_nombre).includes(normalizarTexto(searchTerm)) ||
      normalizarTexto(curso.cupo_total).includes(normalizarTexto(searchTerm)) ||
      normalizarTexto(curso.costo).includes(normalizarTexto(searchTerm))
    const coincideCurso = normalizarTexto(curso.nombre).includes(
      normalizarTexto(filtrosColumna.curso),
    )
    const coincideProfesor =
      !filtrosColumna.profesor ||
      normalizarTexto(curso.profesor_nombre || 'Sin asignar') ===
        normalizarTexto(filtrosColumna.profesor)
    const coincideDescripcion = normalizarTexto(curso.descripcion || 'Sin descripción').includes(
      normalizarTexto(filtrosColumna.descripcion),
    )
    const coincideDuracion = normalizarTexto(obtenerDuracionTexto(curso)).includes(
      normalizarTexto(filtrosColumna.duracion),
    )
    const coincidePrecio = String(curso.costo ?? '').includes(filtrosColumna.precio || '')
    const coincideCupos = String(curso.cupo_total ?? '').includes(filtrosColumna.cupos || '')
    const coincideInicio = coincideFecha(curso.fecha_creacion, filtrosColumna.inicio)
    const coincideFin = coincideFecha(curso.fecha_fin, filtrosColumna.fin)
    const coincideEstado =
      !filtrosColumna.estado ||
      normalizarTexto(curso.estado || 'Sin estado') === normalizarTexto(filtrosColumna.estado)

    return (
      coincideBusquedaGlobal &&
      coincideCurso &&
      coincideProfesor &&
      coincideDescripcion &&
      coincideDuracion &&
      coincidePrecio &&
      coincideCupos &&
      coincideInicio &&
      coincideFin &&
      coincideEstado
    )
  })

  const [pestañaActiva, setPestañaActiva] = useState('Activos')
  const cursosVisibles = cursosFiltrados.filter((curso) =>
    pestañaActiva === 'Activos' ? curso.estado === 'Activo' : curso.estado === 'Inactivo',
  )

  const actualizarFiltroColumna = (columna, valor) => {
    setFiltrosColumna((filtrosActuales) => ({ ...filtrosActuales, [columna]: valor }))
  }

  const renderEncabezadoFiltrable = (titulo, columna, tipo = 'text') => (
    <CTableHeaderCell scope="col" className="table-curso__head">
      <div className="table-curso__heading">
        <span>{titulo}</span>
        <button
          type="button"
          className={`table-curso__filter-toggle${filtrosColumna[columna] ? ' is-active' : ''}`}
          onClick={() => setFiltroAbierto(filtroAbierto === columna ? null : columna)}
          aria-label={`${filtroAbierto === columna ? 'Cerrar' : 'Abrir'} filtro de ${titulo}`}
          aria-expanded={filtroAbierto === columna}
          title={`Filtrar ${titulo}`}
        >
          <CIcon icon={tipo === 'select' ? cilFilter : cilSearch} />
        </button>
      </div>
      {filtroAbierto === columna && (
        <div className="table-curso__filter-control">
          {tipo === 'select' ? (
            <CFormSelect
              value={filtrosColumna[columna] || ''}
              onChange={(event) => actualizarFiltroColumna(columna, event.target.value)}
              aria-label={`Filtrar por ${titulo}`}
              size="sm"
            >
              <option value="">
                {columna === 'profesor' ? 'Todos los profesores' : 'Todos los estados'}
              </option>
              {(columna === 'profesor' ? profesoresDisponibles : estadosCurso).map((opcion) => (
                <option key={opcion} value={opcion}>
                  {String(opcion).charAt(0).toLocaleUpperCase() + String(opcion).slice(1)}
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
              step={tipo === 'number' ? 'any' : undefined}
            />
          )}
        </div>
      )}
    </CTableHeaderCell>
  )

  return (
    <SectionCard
      title="Cursos registrados"
      description={`${cursos.length} curso${cursos.length === 1 ? '' : 's'} en el sistema`}
    >
      <CRow className="mb-3 curso-table__search-row">
        <CCol md={5} lg={4} className="ms-auto curso-table__search-col">
          <CFormInput
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar curso..."
            aria-label="Buscar curso por nombre"
            className="curso-search__input"
          />
        </CCol>
        <CCol xs="auto" className="d-flex justify-content-end">
          <CNav variant="tabs" className="curso-table__nav-tabs">
            <CNavItem>
              <CNavLink
                active={pestañaActiva === 'Activos'}
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  setPestañaActiva(pestañaActiva === 'Activos' ? 'Inactivos' : 'Activos')
                }
                className={
                  pestañaActiva === 'Activos'
                    ? 'curso-table__view-tab curso-table__view-tab--active'
                    : 'curso-table__view-tab curso-table__view-tab--inactive'
                }
              >
                {pestañaActiva === 'Activos' ? '🔴 Dados de Baja' : '🟢 Activos'}
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCol>
      </CRow>
      {cursos.length === 0 ? (
        <div className="bm-table-empty">
          <strong>No hay cursos registrados</strong>
          <span>Los cursos que agregues aparecerán aquí.</span>
        </div>
      ) : (
        <div className="table-responsive table-curso__wrapper">
          <CTable align="middle" hover className="table-curso__table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col" className="table-curso__head">
                  Nro
                </CTableHeaderCell>
                {renderEncabezadoFiltrable('Curso', 'curso')}
                {renderEncabezadoFiltrable('Profesor', 'profesor', 'select')}
                {renderEncabezadoFiltrable('Descripción', 'descripcion')}
                {renderEncabezadoFiltrable('Duración', 'duracion', 'search')}
                {renderEncabezadoFiltrable('Precio', 'precio', 'number')}
                {renderEncabezadoFiltrable('Cupos', 'cupos', 'number')}
                {renderEncabezadoFiltrable('Inicio', 'inicio', 'date')}
                {renderEncabezadoFiltrable('Fin', 'fin', 'date')}
                {renderEncabezadoFiltrable('Estado', 'estado', 'select')}
                <CTableHeaderCell scope="col" className="table-curso__head text-end">
                  Acciones
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {cursosVisibles.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={11} className="table-curso__empty-results">
                    No se encontraron coincidencias
                  </CTableDataCell>
                </CTableRow>
              ) : (
                cursosVisibles.map((curs, index) => {
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
                    <CTableRow key={curs.id_curso} className="table-curso__row">
                      <CTableDataCell className="table-curso__cell text-body-secondary">
                        #{index + 1}
                      </CTableDataCell>
                      <CTableDataCell className="table-curso__cell">
                        <strong>{curs.nombre}</strong>
                      </CTableDataCell>
                      <CTableDataCell className="table-curso__cell">
                        {curs.profesor_nombre ? (
                          curs.profesor_nombre
                        ) : (
                          <CBadge color="warning">Sin asignar</CBadge>
                        )}
                      </CTableDataCell>
                      <CTableDataCell className="table-curso__cell bm-table-description">
                        {curs.descripcion || 'Sin descripción'}
                      </CTableDataCell>
                      <CTableDataCell className="table-curso__cell">
                        {valor ? `${valor} ${unidades[unidad] || unidad}` : 'Sin duración'}
                      </CTableDataCell>
                      <CTableDataCell className="table-curso__cell">
                        {curs.costo ? `Bs. ${curs.costo}` : 'Sin precio'}
                      </CTableDataCell>
                      <CTableDataCell className="table-curso__cell">
                        {curs.cupo_total ?? '---'}
                      </CTableDataCell>
                      <CTableDataCell className="table-curso__cell">
                        {curs.fecha_creacion
                          ? new Date(curs.fecha_creacion).toLocaleDateString()
                          : '---'}
                      </CTableDataCell>
                      <CTableDataCell className="table-curso__cell">
                        {curs.fecha_fin ? new Date(curs.fecha_fin).toLocaleDateString() : '---'}
                      </CTableDataCell>
                      <CTableDataCell className="table-curso__cell">
                        <StatusBadge status={curs.estado || 'inactivo'}>
                          {curs.estado || 'Sin estado'}
                        </StatusBadge>
                      </CTableDataCell>
                      <CTableDataCell className="table-curso__cell text-end">
                        <CButtonGroup size="sm">
                          <CButton
                            color="primary"
                            variant="outline"
                            onClick={() => seleccionarCurso(curs)}
                            className="curso-table__action"
                          >
                            Editar
                          </CButton>

                          <CButton
                            color="danger"
                            variant="outline"
                            onClick={() => eliminarCurso(curs.id_curso)}
                            className="curso-table__action"
                          >
                            {curs.estado === 'Inactivo' ? 'Habilitar' : 'Eliminar'}
                          </CButton>
                        </CButtonGroup>
                      </CTableDataCell>
                    </CTableRow>
                  )
                })
              )}
            </CTableBody>
          </CTable>
        </div>
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
        <CModalBody>Esta acción cambiará el estado del curso. ¿Deseas continuar?</CModalBody>
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

export default CursoTable
