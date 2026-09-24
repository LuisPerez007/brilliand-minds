import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CAlert, CCard, CCardBody, CCol, CContainer, CRow, CSpinner } from '@coreui/react'
import { verificarRecibo } from '../../../services/serviciosPublicos/verificarRecibo'

const VerificarRecibo = () => {
  const { token } = useParams()
  const [estado, setEstado] = useState({ cargando: true, recibo: null, error: '' })

  useEffect(() => {
    let cancelado = false

    const cargarRecibo = async () => {
      try {
        const respuesta = await verificarRecibo(token)
        if (cancelado) return
        setEstado({ cargando: false, recibo: respuesta.data.recibo, error: '' })
      } catch (error) {
        if (cancelado) return
        setEstado({
          cargando: false,
          recibo: null,
          error: error.response?.data?.message || 'No se pudo verificar el recibo.',
        })
      }
    }

    cargarRecibo()

    return () => {
      cancelado = true
    }
  }, [token])

  if (estado.cargando) {
    return (
      <CContainer
        className="verificar-recibo-page verificar-recibo-page--loading bg-white"
        data-coreui-theme="light"
      >
        <div className="verificar-recibo-loader">
          <CSpinner color="primary" />
          <p className="verificar-recibo-loader__text">Verificando recibo...</p>
        </div>
      </CContainer>
    )
  }

  if (estado.error) {
    return (
      <CContainer className="verificar-recibo-page bg-white" data-coreui-theme="light">
        <CRow className="justify-content-center w-100">
          <CCol md={7} lg={6}>
            <CAlert
              color="danger"
              className="verificar-recibo-alert verificar-recibo-alert--error mb-0"
            >
              <h4 className="alert-heading">Recibo no válido</h4>
              <p className="mb-0">{estado.error}</p>
            </CAlert>
          </CCol>
        </CRow>
      </CContainer>
    )
  }

  const { recibo } = estado

  return (
    <CContainer className="verificar-recibo-page bg-white" data-coreui-theme="light">
      <CRow className="justify-content-center w-100">
        <CCol md={8} lg={7}>
          <CCard className="verificar-recibo-card">
            <CCardBody className="verificar-recibo-card__body">
              <CAlert
                color="success"
                className="verificar-recibo-alert verificar-recibo-alert--success"
              >
                <h4 className="alert-heading">Recibo válido</h4>
                <p className="mb-0">Este recibo está registrado en la Academia.</p>
              </CAlert>
              <dl className="verificar-recibo-details">
                <dt>Código de verificación</dt>
                <dd>Recibo verificado</dd>
                <dt>Padre o tutor</dt>
                <dd>{recibo.padre_tutor || 'Sin información'}</dd>
                <dt>CI</dt>
                <dd>{recibo.padre_ci || 'Sin información'}</dd>
                <dt>Estudiante</dt>
                <dd>{recibo.estudiante || 'Sin información'}</dd>
                <dt>Curso</dt>
                <dd>{recibo.curso || 'Sin información'}</dd>
                <dt>Monto pagado</dt>
                <dd>Bs. {Number(recibo.monto_pagado || 0).toFixed(2)}</dd>
                <dt>Fecha de pago</dt>
                <dd>
                  {recibo.fecha_pago
                    ? new Date(recibo.fecha_pago).toLocaleString('es-BO')
                    : 'Sin información'}
                </dd>
              </dl>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default VerificarRecibo
