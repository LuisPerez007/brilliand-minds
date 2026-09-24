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
      <div className="preinscripcion-cursos__page">
        {feedback && (
          <CAlert
            color={feedback.color}
            dismissible
            onClose={limpiarFeedback}
            className="preinscripcion-cursos__alert"
          >
            {feedback.message}
          </CAlert>
        )}
        {tieneDeudasPendientes && (
          <CAlert
            color="danger"
            className="preinscripcion-cursos__alert preinscripcion-cursos__alert--danger"
          >
            <div className="preinscripcion-cursos__deuda-header">
              Hola, {deudasPendientes[0]?.estudiante || 'Estudiante'}! Tienes pagos pendientes con
              la administración.
            </div>
            <p className="preinscripcion-cursos__deuda-text">
              Regulariza estas obligaciones antes de solicitar nuevas inscripciones:
            </p>
            <ul className="preinscripcion-cursos__deuda-list">
              {deudasPendientes.map((deuda, index) => (
                <li key={`${deuda.id_curso}-${deuda.periodo}-${index}`}>
                  <strong>{deuda.materia || 'Curso sin nombre'}</strong>
                  <span className="preinscripcion-cursos__deuda-meta">
                    Periodo: {deuda.periodo || 'Sin periodo'}
                  </span>
                  <span className="preinscripcion-cursos__deuda-meta">
                    Costo: Bs. {deuda.costo ?? '0.00'}
                  </span>
                </li>
              ))}
            </ul>
          </CAlert>
        )}
        {cargandoEstadoCuenta && (
          <CAlert
            color="info"
            className="preinscripcion-cursos__alert preinscripcion-cursos__alert--info"
          >
            <CSpinner size="sm" className="me-2" /> Verificando el estado de tu cuenta...
          </CAlert>
        )}

        <div className="preinscripcion-cursos__content">
          <TablePreinscripcionACursosEstudiantes
            cursosNoInscritos={cursosNoInscritos}
            crearInscripcionAunCursoParaEstudiante={crearInscripcionAunCursoParaEstudiante}
            inscripcionBloqueada={tieneDeudasPendientes || cargandoEstadoCuenta}
          />
        </div>
      </div>

      <CModal
        visible={inscripcionExitosa}
        onClose={cerrarConfirmacion}
        alignment="center"
        className="preinscripcion-cursos__modal"
      >
        <CModalHeader closeButton>
          <CModalTitle>Solicitud procesada</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CAlert color="success" className="preinscripcion-cursos__modal-alert mb-3">
            Tu solicitud de inscripción se procesó correctamente.
          </CAlert>
          <p className="preinscripcion-cursos__modal-text mb-0">
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
