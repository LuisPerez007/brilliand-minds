import {
  CAlert,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react'
import TablePreinscripcionACursosEstudiantes from './components/TablePreinscripcionACursosEstudiantes'
import { usePreinscripcionACursosEstudiantes } from './hooks/usePreinscripcionACursosEstudiantes'

const PreinscripcionACursosEstudiantes = () => {
  const {
    cursosNoInscritos,
    crearInscripcionAunCursoParaEstudiante,
    tieneDeudasPendientes,
    deudasPendientes,
    cargandoEstadoCuenta,
    feedback,
    limpiarFeedback,
    inscripcionExitosa,
    cerrarConfirmacion,
  } = usePreinscripcionACursosEstudiantes()

  return (
    <>
      {feedback && (
        <CAlert color={feedback.color} dismissible onClose={limpiarFeedback}>
          {feedback.message}
        </CAlert>
      )}
      {tieneDeudasPendientes && (
        <CAlert color="danger" className="bg-danger-subtle text-danger p-3 rounded mb-3">
          <div className="fw-semibold mb-2">
            Hola, {deudasPendientes[0]?.estudiante || 'Estudiante'}! Tienes pagos pendientes con la
            administración.
          </div>
          <p className="mb-2">
            Regulariza estas obligaciones antes de solicitar nuevas inscripciones:
          </p>
          <ul className="mb-0 ps-3">
            {deudasPendientes.map((deuda, index) => (
              <li key={`${deuda.id_curso}-${deuda.periodo}-${index}`}>
                <strong>{deuda.materia || 'Curso sin nombre'}</strong>
                <span className="ms-2">Periodo: {deuda.periodo || 'Sin periodo'}</span>
                <span className="ms-2">Costo: Bs. {deuda.costo ?? '0.00'}</span>
              </li>
            ))}
          </ul>
        </CAlert>
      )}
      {cargandoEstadoCuenta && (
        <CAlert color="info">
          <CSpinner size="sm" className="me-2" /> Verificando el estado de tu cuenta...
        </CAlert>
      )}
      <TablePreinscripcionACursosEstudiantes
        cursosNoInscritos={cursosNoInscritos}
        crearInscripcionAunCursoParaEstudiante={crearInscripcionAunCursoParaEstudiante}
        inscripcionBloqueada={tieneDeudasPendientes || cargandoEstadoCuenta}
      />
      <CModal visible={inscripcionExitosa} onClose={cerrarConfirmacion} alignment="center">
        <CModalHeader closeButton>
          <CModalTitle>Solicitud procesada</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CAlert color="success" className="mb-3">
            Tu solicitud de inscripción se procesó correctamente.
          </CAlert>
          <p className="mb-0">
            Para asegurar tu cupo definitivo, debes realizar el pago de la matrícula en efectivo
            directamente en ventanilla con el administrador de la academia.
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton color="success" onClick={cerrarConfirmacion}>
            Entendido
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}
export default PreinscripcionACursosEstudiantes
