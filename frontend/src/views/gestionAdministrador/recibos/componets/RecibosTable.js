import { useState } from 'react'
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { EmptyState, SectionCard } from '../../../../components'
import { generarReciboPdf } from '../../../utils/generarReciboPdf'

const formatearMonto = (monto) => `$${Number(monto || 0).toFixed(2)}`

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha'

  const fechaFormateada = new Date(fecha).toLocaleDateString()
  return fechaFormateada === 'Invalid Date' ? 'Sin fecha' : fechaFormateada
}

const agruparRecibosPorPadre = (recibos) => {
  const grupos = new Map()

  recibos.forEach((recibo, index) => {
    const tieneIdPadre = recibo.id_padre !== null && recibo.id_padre !== undefined
    const identificador = tieneIdPadre
      ? `id:${recibo.id_padre}`
      : recibo.padre_ci
        ? `ci:${recibo.padre_ci}`
        : `sin-identificador:${index}`

    if (!grupos.has(identificador)) {
      grupos.set(identificador, {
        identificador,
        padre_tutor: recibo.padre_tutor || 'Sin nombre registrado',
        padre_ci: recibo.padre_ci || 'Sin CI',
        recibos: [],
        total: 0,
      })
    }

    const grupo = grupos.get(identificador)
    grupo.recibos.push(recibo)
    grupo.total += Number(recibo.monto_pagado || 0)
  })

  return Array.from(grupos.values())
}

const normalizarTexto = (valor) =>
  String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

const coincideTexto = (valor, filtro) => {
  if (!filtro) return true
  return normalizarTexto(valor).includes(normalizarTexto(filtro))
}

const coincideNumero = (valor, filtro) => {
  if (!filtro) return true
  const textoValor = String(valor ?? '').replace(/[$,\s]/g, '')
  return textoValor.includes(String(filtro).trim())
}

const coincideFecha = (valor, filtro) => {
  if (!filtro) return true
  if (!valor) return false

  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return false

  return fecha.toISOString().slice(0, 10) === filtro
}

const RecibosTable = ({ recibos, searchTerm = '' }) => {
  const [padreSeleccionadoId, setPadreSeleccionadoId] = useState(null)
  const [reciboProcesandoId, setReciboProcesandoId] = useState(null)
  const [filtroAbierto, setFiltroAbierto] = useState(null)
  const [filtrosResumen, setFiltrosResumen] = useState({
    padre_tutor: '',
    padre_ci: '',
    recibos: '',
    total: '',
  })
  const [filtrosDetalle, setFiltrosDetalle] = useState({
    id_recibo: '',
    estudiante: '',
    curso: '',
    monto_pagado: '',
    fecha_pago: '',
  })

  const grupos = agruparRecibosPorPadre(recibos)

  const padreSeleccionado =
    padreSeleccionadoId !== null
      ? grupos.find((grupo) => grupo.identificador === padreSeleccionadoId) || null
      : null

  const actualizarFiltroResumen = (campo, valor) => {
    setFiltrosResumen((prev) => ({ ...prev, [campo]: valor }))
  }

  const actualizarFiltroDetalle = (campo, valor) => {
    setFiltrosDetalle((prev) => ({ ...prev, [campo]: valor }))
  }

  const renderFilterControl = (scope, key, label, type = 'text') => {
    const filterKey = `${scope}:${key}`
    const isOpen = filtroAbierto === filterKey
    const currentValue = scope === 'summary' ? filtrosResumen[key] : filtrosDetalle[key]

    return (
      <CTableHeaderCell className="table-recibos__head">
        <div className="table-recibos__header">
          <span>{label}</span>
          <button
            type="button"
            className={`table-recibos__filter-toggle ${isOpen ? 'is-open' : ''}`}
            onClick={() => setFiltroAbierto(isOpen ? null : filterKey)}
            aria-label={`Filtrar por ${label}`}
          >
            {type === 'date' ? '🔽' : '🔍'}
          </button>
        </div>
        {isOpen && (
          <div className="table-recibos__filter-panel">
            {type === 'date' ? (
              <input
                type="date"
                className="table-recibos__filter-input"
                value={currentValue}
                onChange={(event) => {
                  const nextValue = event.target.value
                  if (scope === 'summary') {
                    actualizarFiltroResumen(key, nextValue)
                  } else {
                    actualizarFiltroDetalle(key, nextValue)
                  }
                }}
              />
            ) : type === 'number' ? (
              <input
                type="number"
                className="table-recibos__filter-input"
                value={currentValue}
                onChange={(event) => {
                  const nextValue = event.target.value
                  if (scope === 'summary') {
                    actualizarFiltroResumen(key, nextValue)
                  } else {
                    actualizarFiltroDetalle(key, nextValue)
                  }
                }}
              />
            ) : (
              <input
                type="text"
                className="table-recibos__filter-input"
                value={currentValue}
                placeholder="Buscar"
                onChange={(event) => {
                  const nextValue = event.target.value
                  if (scope === 'summary') {
                    actualizarFiltroResumen(key, nextValue)
                  } else {
                    actualizarFiltroDetalle(key, nextValue)
                  }
                }}
              />
            )}
          </div>
        )}
      </CTableHeaderCell>
    )
  }

  const gruposFiltrados = grupos.filter((grupo) => {
    const cumpleBusquedaGlobal =
      searchTerm.trim() === '' ||
      [grupo.padre_tutor, grupo.padre_ci, String(grupo.total), String(grupo.recibos.length)].some(
        (valor) => coincideTexto(valor, searchTerm),
      )

    const cumplePadreTutor = coincideTexto(grupo.padre_tutor, filtrosResumen.padre_tutor)
    const cumpleCi = coincideTexto(grupo.padre_ci, filtrosResumen.padre_ci)
    const cumpleRecibos = coincideNumero(grupo.recibos.length, filtrosResumen.recibos)
    const cumpleTotal = coincideNumero(grupo.total, filtrosResumen.total)

    return cumpleBusquedaGlobal && cumplePadreTutor && cumpleCi && cumpleRecibos && cumpleTotal
  })

  const recibosHijosFiltrados =
    padreSeleccionado?.recibos.filter((recibo) => {
      const cumpleBusquedaGlobal =
        searchTerm.trim() === '' ||
        [
          recibo.estudiante,
          recibo.curso,
          recibo.padre_tutor,
          recibo.padre_ci,
          recibo.monto_pagado,
        ].some((valor) => coincideTexto(valor, searchTerm))

      const cumpleRecibo = coincideNumero(recibo.id_recibo, filtrosDetalle.id_recibo)
      const cumpleEstudiante = coincideTexto(recibo.estudiante, filtrosDetalle.estudiante)
      const cumpleCurso = coincideTexto(recibo.curso, filtrosDetalle.curso)
      const cumpleMonto = coincideNumero(recibo.monto_pagado, filtrosDetalle.monto_pagado)
      const cumpleFecha = coincideFecha(recibo.fecha_pago, filtrosDetalle.fecha_pago)

      return (
        cumpleBusquedaGlobal &&
        cumpleRecibo &&
        cumpleEstudiante &&
        cumpleCurso &&
        cumpleMonto &&
        cumpleFecha
      )
    }) || []

  if (padreSeleccionado) {
    return (
      <SectionCard
        title="Pagos del padre o tutor"
        description="Detalle de los recibos registrados para el padre o tutor seleccionado."
      >
        <div className="recibos-detail__summary">
          <div>
            <div className="recibos-detail__label">Padre/Tutor</div>
            <h5 className="recibos-detail__name">{padreSeleccionado.padre_tutor}</h5>
            <div className="recibos-detail__meta">CI: {padreSeleccionado.padre_ci}</div>
          </div>
          <div className="recibos-detail__meta">
            <div>Total de recibos: {recibosHijosFiltrados.length}</div>
            <div>
              Total pagado:{' '}
              {formatearMonto(
                recibosHijosFiltrados.reduce(
                  (total, recibo) => total + Number(recibo.monto_pagado || 0),
                  0,
                ),
              )}
            </div>
          </div>
        </div>

        <CButton
          color="secondary"
          variant="outline"
          className="recibos-detail__back mb-3"
          onClick={() => setPadreSeleccionadoId(null)}
        >
          Volver al resumen
        </CButton>

        <div className="table-responsive table-recibos__wrapper">
          <CTable align="middle" hover className="table-recibos__table">
            <CTableHead>
              <CTableRow>
                {renderFilterControl('detail', 'id_recibo', 'Recibo', 'number')}
                {renderFilterControl('detail', 'estudiante', 'Estudiante')}
                {renderFilterControl('detail', 'curso', 'Curso')}
                {renderFilterControl('detail', 'monto_pagado', 'Monto', 'number')}
                {renderFilterControl('detail', 'fecha_pago', 'Fecha', 'date')}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {recibosHijosFiltrados.length === 0 && padreSeleccionado.recibos.length > 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={5} className="table-recibos__empty-results">
                    No se encontraron resultados
                  </CTableDataCell>
                </CTableRow>
              ) : (
                recibosHijosFiltrados.map((recibo, index) => {
                  return (
                    <CTableRow
                      key={
                        recibo.id_recibo ||
                        `${padreSeleccionado.identificador}-${recibo.fecha_pago}-${recibo.monto_pagado}-${recibo.curso || recibo.estudiante}`
                      }
                      className="table-recibos__row"
                    >
                      <CTableDataCell className="table-recibos__cell">
                        {recibo.id_recibo || index + 1}
                      </CTableDataCell>
                      <CTableDataCell className="table-recibos__cell">
                        {recibo.estudiante || 'Sin estudiante'}
                      </CTableDataCell>
                      <CTableDataCell className="table-recibos__cell">
                        {recibo.curso || 'Sin curso'}
                      </CTableDataCell>
                      <CTableDataCell className="table-recibos__cell">
                        {formatearMonto(recibo.monto_pagado)}
                      </CTableDataCell>
                      <CTableDataCell className="table-recibos__cell">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {formatearFecha(recibo.fecha_pago)}
                          <CButton
                            color="primary"
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              try {
                                setReciboProcesandoId(recibo.id_recibo)
                                const tokenVerificacion = recibo.token_verificacion || ''
                                await new Promise((resolve) => setTimeout(resolve, 50))
                                await generarReciboPdf({
                                  ...recibo,
                                  token_verificacion: tokenVerificacion,
                                  estudiante_nombre: recibo.estudiante || 'Sin información',
                                  estudiante_ci:
                                    recibo.estudiante_ci || recibo.ci || 'Sin información',
                                  padre_tutor: recibo.padre_tutor || 'Sin información',
                                  padre_ci: recibo.padre_ci || 'Sin información',
                                  monto_pagado: Number(recibo.monto_pagado || 0),
                                  fecha_pago: recibo.fecha_pago || new Date().toISOString(),
                                  conceptos: [
                                    {
                                      descripcion: recibo.curso || 'Curso',
                                      monto: Number(recibo.monto_pagado || 0),
                                    },
                                  ],
                                })
                              } finally {
                                setReciboProcesandoId(null)
                              }
                            }}
                          >
                            {reciboProcesandoId === recibo.id_recibo
                              ? `Generando recibo...`
                              : `Imprimir`}
                          </CButton>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  )
                })
              )}
            </CTableBody>
          </CTable>
        </div>
      </SectionCard>
    )
  }

  if (grupos.length === 0) {
    return (
      <EmptyState
        title="No se encontraron recibos"
        description="Prueba con otro CI del padre o tutor."
      />
    )
  }

  return (
    <SectionCard
      title="Resumen por padre o tutor"
      description="Cada padre o tutor aparece una sola vez con el total de sus pagos."
    >
      <div className="table-responsive table-recibos__wrapper">
        <CTable align="middle" hover className="table-recibos__table">
          <CTableHead>
            <CTableRow>
              {renderFilterControl('summary', 'padre_tutor', 'Padre / Tutor')}
              {renderFilterControl('summary', 'padre_ci', 'CI')}
              {renderFilterControl('summary', 'recibos', 'Recibos', 'number')}
              {renderFilterControl('summary', 'total', 'Total', 'number')}
              <CTableHeaderCell className="table-recibos__head text-end">Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {gruposFiltrados.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={5} className="table-recibos__empty-results">
                  No se encontraron resultados
                </CTableDataCell>
              </CTableRow>
            ) : (
              gruposFiltrados.map((grupo) => (
                <CTableRow key={grupo.identificador} className="table-recibos__row">
                  <CTableDataCell className="table-recibos__cell">
                    {grupo.padre_tutor}
                  </CTableDataCell>
                  <CTableDataCell className="table-recibos__cell">{grupo.padre_ci}</CTableDataCell>
                  <CTableDataCell className="table-recibos__cell">
                    <span className="recibos-badge">{grupo.recibos.length}</span>
                  </CTableDataCell>
                  <CTableDataCell className="table-recibos__cell">
                    {formatearMonto(grupo.total)}
                  </CTableDataCell>
                  <CTableDataCell className="table-recibos__cell text-end">
                    <CButton
                      color="primary"
                      variant="outline"
                      className="recibos-action__button"
                      onClick={() => setPadreSeleccionadoId(grupo.identificador)}
                    >
                      Ver pagos
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    </SectionCard>
  )
}

export default RecibosTable
