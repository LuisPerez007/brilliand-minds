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
        <div className="preinscripcion-cursos__empty-state">
          <h1 className="preinscripcion-cursos__title">CURSOS DISPONIBLEES</h1>
          <h2 className="preinscripcion-cursos__subtitle">No hay cursos disponibles</h2>
        </div>
      ) : (
        <div className="preinscripcion-cursos__section">
          <div className="preinscripcion-cursos__header">
            <h1 className="preinscripcion-cursos__title">CURSOS DISPONIBLES</h1>
            <h2 className="preinscripcion-cursos__subtitle">
              Ecuentra y selecciona el curso que deseas realizar
            </h2>
          </div>

          <div className="table-responsive preinscripcion-cursos__table-wrapper">
            <div className="preinscripcion-cursos__grid">
              {cursosNoInscritos.map((curso) => (
                <article key={curso.id_curso} className="preinscripcion-cursos__card">
                  <div className="preinscripcion-cursos__card-header">
                    <h3 className="preinscripcion-cursos__course-title">{curso.materia}</h3>
                  </div>

                  <p className="preinscripcion-cursos__description">{curso.descripcion}</p>

                  <div className="preinscripcion-cursos__meta">
                    <div className="preinscripcion-cursos__cell preinscripcion-cursos__meta-item">
                      <CIcon icon={cilClock} className="me-2" />
                      <span>{mostrarDuracion(curso.duracion)}</span>
                    </div>
                    <div className="preinscripcion-cursos__cell preinscripcion-cursos__meta-item">
                      <CIcon icon={cilPeople} className="me-2" />
                      <span>{curso.cupo_total} cupos disponibles</span>
                    </div>
                    <div className="preinscripcion-cursos__cell preinscripcion-cursos__meta-item">
                      <CIcon icon={cilMoney} className="me-2" />
                      <span>Bs. {curso.costo}</span>
                    </div>
                  </div>

                  <p className="preinscripcion-cursos__modalidad">
                    <strong>Modalidad de clases: </strong>
                    <span> El horario será coordinado según la disponibilidad.</span>
                  </p>

                  <div className="preinscripcion-cursos__actions">
                    <button
                      className="btn btn-primary preinscripcion-cursos__button"
                      disabled={inscripcionBloqueada}
                      onClick={() => crearInscripcionAunCursoParaEstudiante(curso.id_curso)}
                    >
                      Inscribirse
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default TablePreinscripcionACursosEstudiantes
