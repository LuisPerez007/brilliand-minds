import TableControlPagosEstudiante from './components/TableControlPagosEstudiante'
import { useControlPagosEstudiante } from './hooks/useControlPagosEstudiante'
import { FeedbackAlert, PageHeader } from '../../../components'

const ControlPagosEstudiante = () => {
  const {
    listaEstudiantesNoPagados,
    padresTutores,
    estudiantes,
    marcarInscripcionComoPagada,
    feedback,
    limpiarFeedback,
    pagoEnProceso,
  } = useControlPagosEstudiante()
  return (
    <>
      <PageHeader
        eyebrow="Finanzas"
        title="Control de pagos"
        description="Revisa las inscripciones pendientes y registra los pagos recibidos."
      />
      <FeedbackAlert feedback={feedback} onClose={limpiarFeedback} />
      <TableControlPagosEstudiante
        listaEstudiantesNoPagados={listaEstudiantesNoPagados}
        padresTutores={padresTutores}
        estudiantes={estudiantes}
        marcarInscripcionComoPagada={marcarInscripcionComoPagada}
        pagoEnProceso={pagoEnProceso}
      />
    </>
  )
}

export default ControlPagosEstudiante
