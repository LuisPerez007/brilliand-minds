import { useState } from 'react'
import { CCard, CCardBody, CCol, CFormInput, CRow } from '@coreui/react'
import RecibosTable from './componets/RecibosTable'
import { useRecibos } from './hooks/useRecibos.js'

const Recibos = () => {
  const { recibos } = useRecibos()
  const [searchTerm, setSearchTerm] = useState('')
  const normalizarTexto = (texto) =>
    String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  const recibosFiltrados = recibos.filter((recibo) => {
    console.log(`recibo: ${JSON.stringify(recibo, null, 2)}`)
    return (
      normalizarTexto(recibo.padre_tutor).includes(normalizarTexto(searchTerm)) ||
      normalizarTexto(recibo.padre_ci).includes(normalizarTexto(searchTerm)) ||
      normalizarTexto(recibo.monto_pagado).includes(normalizarTexto(searchTerm)) ||
      normalizarTexto(recibo.estudiante).includes(normalizarTexto(searchTerm)) ||
      normalizarTexto(recibo.curso).includes(normalizarTexto(searchTerm))
    )
  })
  const dineroRecaudado = recibos.reduce(
    (total, recibo) => total + parseFloat(recibo.monto_pagado),
    0,
  )

  return (
    <div className="recibos-page__container">
      <CCard className="recibos-page__card mb-4">
        <CCardBody className="recibos-page__body">
          <CRow className="align-items-center mb-3 recibos-page__header">
            <CCol md={6}>
              <div className="recibos-page__eyebrow">Gestión financiera</div>
              <h4 className="recibos-page__title">Historial de Recibos de Caja</h4>
              <div className="recibos-page__totals">
                <span className="recibos-badge">total de recibos: {recibos.length}</span>
                <span className="recibos-badge recibos-badge--accent">
                  Dinero recaudado: ${dineroRecaudado.toFixed(2)}
                </span>
              </div>
            </CCol>
            <CCol md={6} className="align-self-end recibos-search__col">
              <CFormInput
                className="recibos-search__input text-body"
                type="text"
                placeholder="Buscar por CI del padre o tutor"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol>
          </CRow>
          <RecibosTable recibos={recibosFiltrados} searchTerm={searchTerm} />
        </CCardBody>
      </CCard>
    </div>
  )
}

export default Recibos
