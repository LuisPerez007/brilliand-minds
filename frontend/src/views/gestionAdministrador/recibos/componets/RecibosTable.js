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

const RecibosTable = ({ recibos }) => {
  const [padreSeleccionado, setPadreSeleccionado] = useState(null)
  const grupos = agruparRecibosPorPadre(recibos)

  if (padreSeleccionado) {
    return (
      <SectionCard
        title="Pagos del padre o tutor"
        description="Detalle de los recibos registrados para el padre o tutor seleccionado."
      >
        <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
          <div>
            <div className="text-body-secondary">Padre/Tutor</div>
            <h5 className="mb-2">{padreSeleccionado.padre_tutor}</h5>
            <div className="text-body-secondary">CI: {padreSeleccionado.padre_ci}</div>
          </div>
          <div className="text-body-secondary">
            <div>Total de recibos: {padreSeleccionado.recibos.length}</div>
            <div>Total pagado: {formatearMonto(padreSeleccionado.total)}</div>
          </div>
        </div>

        <CButton
          color="secondary"
          variant="outline"
          className="mb-3"
          onClick={() => setPadreSeleccionado(null)}
        >
          Volver al resumen
        </CButton>

        <CTable align="middle" hover responsive className="bm-admin-table">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Recibo</CTableHeaderCell>
              <CTableHeaderCell>Estudiante</CTableHeaderCell>
              <CTableHeaderCell>Curso</CTableHeaderCell>
              <CTableHeaderCell>Monto</CTableHeaderCell>
              <CTableHeaderCell>Fecha</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {padreSeleccionado.recibos.map((recibo, index) => (
              <CTableRow
                key={
                  recibo.id_recibo ||
                  `${padreSeleccionado.identificador}-${recibo.fecha_pago}-${recibo.monto_pagado}-${recibo.curso || recibo.estudiante}`
                }
              >
                <CTableDataCell>{recibo.id_recibo || index + 1}</CTableDataCell>
                <CTableDataCell>{recibo.estudiante || 'Sin estudiante'}</CTableDataCell>
                <CTableDataCell>{recibo.curso || 'Sin curso'}</CTableDataCell>
                <CTableDataCell>{formatearMonto(recibo.monto_pagado)}</CTableDataCell>
                <CTableDataCell>{formatearFecha(recibo.fecha_pago)}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
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
      <CTable align="middle" hover responsive className="bm-admin-table">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Padre / Tutor</CTableHeaderCell>
            <CTableHeaderCell>CI</CTableHeaderCell>
            <CTableHeaderCell>Recibos</CTableHeaderCell>
            <CTableHeaderCell>Total</CTableHeaderCell>
            <CTableHeaderCell className="text-end">Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {grupos.map((grupo) => (
            <CTableRow key={grupo.identificador}>
              <CTableDataCell>{grupo.padre_tutor}</CTableDataCell>
              <CTableDataCell>{grupo.padre_ci}</CTableDataCell>
              <CTableDataCell>{grupo.recibos.length}</CTableDataCell>
              <CTableDataCell>{formatearMonto(grupo.total)}</CTableDataCell>
              <CTableDataCell className="text-end">
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={() => setPadreSeleccionado(grupo)}
                >
                  Ver pagos
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </SectionCard>
  )
}

export default RecibosTable
