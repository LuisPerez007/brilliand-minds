import { mostrarDuracion } from '../../../utils/duracion'
import { cilClock, cilPeople, cilMoney } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
const TablePreinscripcionACursosEstudiantes = ({
  cursosNoInscritos,
  crearInscripcionAunCursoParaEstudiante,
  inscripcionBloqueada,
}) => {
  return (
    <>
      {cursosNoInscritos.length === 0 ? (
        <>
          <div style={{ textAlign: 'center' }}>
            <h1>CURSOS DISPONBLEES</h1>
            <h2>No hay cursos disponibles</h2>
          </div>
        </>
      ) : (
        <>
          <h1 style={{ textAlign: 'center' }}>CURSOS DISPONIBLES</h1>
          <h2>Ecuentra y selecciona el curso que deseas realizar</h2>
          {cursosNoInscritos.map((curso) => (
            <div
              key={curso.id_curso}
              style={{
                border: '1px solid #dee2e6',
                borderRadius: '10px',
                margin: '10px',
                padding: '10px',
              }}
            >
              <h3 style={{ textAlign: 'center' }}>{curso.materia}</h3>
              <p>{curso.descripcion}</p>
              <div>
                <span>
                  <CIcon icon={cilClock} className="me-2" />
                  {mostrarDuracion(curso.duracion)}
                </span>
                <br />
                <span>
                  <CIcon icon={cilPeople} className="me-2" />
                  {curso.cupo_total} cupos disponibles
                </span>
                <br />
                <span>
                  <CIcon icon={cilMoney} className="me-2" />
                  Bs. {curso.costo}
                </span>
              </div>
              <p>
                <strong>Modalidad de clases: </strong>
                <span> El horario será coordinado según la disponibilidad.</span>
              </p>
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-primary"
                  disabled={inscripcionBloqueada}
                  onClick={() => crearInscripcionAunCursoParaEstudiante(curso.id_curso)}
                >
                  Inscribirse
                </button>
              </div>
            </div>
          ))}
          <br />
          <br />
        </>
      )}
    </>
  )
}
export default TablePreinscripcionACursosEstudiantes
