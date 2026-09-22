import { useState } from 'react'
import { CCard, CCardBody, CCol, CFormInput, CRow } from '@coreui/react'
import RecibosTable from './componets/RecibosTable'
import { useRecibos } from './hooks/useRecibos.js'

const Recibos = () => {
  const { recibos } = useRecibos()
  const [busquedaCi, setBusquedaCi] = useState('')
  const dineroRecaudado = recibos.reduce(
    (total, recibo) => total + parseFloat(recibo.monto_pagado),
    0,
  )
  const recibosFiltrados = recibos.filter((recibo) => {
    if (!busquedaCi) {
      return true
    }
    return String(recibo.padre_ci).toLocaleLowerCase().includes(busquedaCi.toLowerCase().trim())
  })

  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <CRow className="align-items-center mb-3">
            <CCol md={6}>
              <h4>Historial de Recibos de Caja</h4>
              <h6>total de recibos: {recibos.length}</h6>
              <h6>Dinero recaudado: ${dineroRecaudado.toFixed(2)}</h6>
            </CCol>
            <CCol md={6} className="align-self-end">
              <CFormInput
                type="text"
                placeholder="Buscar por CI del padre o tutor"
                value={busquedaCi}
                onChange={(e) => setBusquedaCi(e.target.value)}
              />
            </CCol>
          </CRow>
          <RecibosTable recibos={recibosFiltrados} />
        </CCardBody>
      </CCard>
    </>
  )
}

export default Recibos
