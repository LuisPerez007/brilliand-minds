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
      <CContainer className="py-5 text-center">
        <CSpinner color="primary" />
        <p className="mt-3">Verificando recibo...</p>
      </CContainer>
    )
  }

  if (estado.error) {
    return (
      <CContainer className="py-5">
        <CRow className="justify-content-center">
          <CCol md={7} lg={6}>
            <CAlert color="danger" className="mb-0">
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
    <CContainer className="py-5">
      <CRow className="justify-content-center">
        <CCol md={8} lg={7}>
          <CCard>
            <CCardBody>
              <CAlert color="success">
                <h4 className="alert-heading">Recibo válido</h4>
                <p className="mb-0">Este recibo está registrado en la Academia.</p>
              </CAlert>
              <dl className="row mb-0">
                <dt className="col-sm-5">Código de verificación</dt>
                <dd className="col-sm-7">Recibo verificado</dd>
                <dt className="col-sm-5">Padre o tutor</dt>
                <dd className="col-sm-7">{recibo.padre_tutor || 'Sin información'}</dd>
                <dt className="col-sm-5">CI</dt>
                <dd className="col-sm-7">{recibo.padre_ci || 'Sin información'}</dd>
                <dt className="col-sm-5">Estudiante</dt>
                <dd className="col-sm-7">{recibo.estudiante || 'Sin información'}</dd>
                <dt className="col-sm-5">Curso</dt>
                <dd className="col-sm-7">{recibo.curso || 'Sin información'}</dd>
                <dt className="col-sm-5">Monto pagado</dt>
                <dd className="col-sm-7">Bs. {Number(recibo.monto_pagado || 0).toFixed(2)}</dd>
                <dt className="col-sm-5">Fecha de pago</dt>
                <dd className="col-sm-7">
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
