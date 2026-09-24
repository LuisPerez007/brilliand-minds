import { left } from '@popperjs/core'

const TableCursosResultadosExamenEstudiante = ({
  cursosEstudiante,
  cargarCalificacionesDeunCursoEstudiante,
  calificacionesDeunCurso,
  setCalificacionesDeunCurso,
  mostrandoCalificaciones,
  setMostrandoCalificaciones,
}) => {
  const notaFinal = calificacionesDeunCurso.reduce(
    (total, calif) => total + Math.round((calif.nota * calif.porcentaje) / 100),
    0,
  )
  return (
    <>
      <ul className="table-cursos-resultados">
        {cursosEstudiante.length === 0 ? (
          <>
            <h1 className="table-cursos-resultados__empty-title">
              No esta inscrito en ningun curso
            </h1>
          </>
        ) : calificacionesDeunCurso.length !== 0 ? (
          <>
            <div className="table-cursos-resultados__header">
              <h1>
                Mostrando examenes del curso: <span>{calificacionesDeunCurso[0].materia}</span>
              </h1>
            </div>

            <div className="table-responsive table-cursos-resultados__wrapper">
              <table className="table table-cursos-resultados__table">
                <thead>
                  <tr>
                    <th className="table-cursos-resultados__head">Nombre de Evaluacion</th>
                    <th className="table-cursos-resultados__head">fecha de examen</th>
                    <th className="table-cursos-resultados__head">Obsercación</th>
                    <th className="table-cursos-resultados__head">Nota</th>
                    <th className="table-cursos-resultados__head">Ponderación</th>
                    <th className="table-cursos-resultados__head">Calificación total</th>
                  </tr>
                </thead>
                <tbody>
                  {calificacionesDeunCurso.map((calCur) => (
                    <tr key={calCur.id_evaluacion} className="table-cursos-resultados__row">
                      <td className="table-cursos-resultados__cell">{calCur.nombre_evaluacion}</td>
                      <td className="table-cursos-resultados__cell">
                        {new Date(calCur.fecha_evaluacion).toLocaleDateString()}
                      </td>
                      <td className="table-cursos-resultados__cell">{calCur.observacion}</td>
                      <td className="table-cursos-resultados__cell">{Math.round(calCur.nota)}</td>
                      <td className="table-cursos-resultados__cell">{calCur.porcentaje}%</td>
                      <td className="table-cursos-resultados__cell">
                        {Math.round((calCur.nota * calCur.porcentaje) / 100)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      className="table-cursos-resultados__cell table-cursos-resultados__spacer"
                      colSpan={4}
                    ></td>
                    <td className="table-cursos-resultados__cell table-cursos-resultados__total-label">
                      <strong>Notal Final</strong>
                    </td>
                    <td
                      className={`table-cursos-resultados__cell table-cursos-resultados__total-score ${
                        notaFinal >= 60 ? 'is-pass' : notaFinal >= 40 ? 'is-pending' : 'is-fail'
                      }`}
                    >
                      {notaFinal}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="table-cursos-resultados__actions">
              <button
                className="btn btn-outline-primary"
                onClick={() => setCalificacionesDeunCurso([])}
              >
                atras
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="table-cursos-resultados__title-wrap" style={{ textAlign: 'center' }}>
              <h1 className="table-cursos-resultados__title">HISTORIAL ACADEMICO</h1>
              <p className="table-cursos-resultados__subtitle">Cursos y rendimiento por período</p>
            </div>

            {cursosEstudiante.map((curEs, index) => (
              <div key={curEs.id_curso} className="table-cursos-resultados__period-group">
                {index === 0 || cursosEstudiante[index - 1].periodo !== curEs.periodo ? (
                  <>
                    <h1 className="table-cursos-resultados__periodo">
                      Periodo: <small>{curEs.periodo}</small>
                    </h1>
                  </>
                ) : null}
                <li className="table-cursos-resultados__period-item">
                  <div className="table-cursos-resultados__course-item">
                    <span className="table-cursos-resultados__course-name">{curEs.materia}</span>
                    <button
                      className="btn btn-primary table-cursos-resultados__action-btn"
                      onClick={() => {
                        cargarCalificacionesDeunCursoEstudiante(curEs.id_curso)
                      }}
                    >
                      Ver notas
                    </button>
                    <p className="table-cursos-resultados__course-date">
                      curso realizado:{' '}
                      {new Date(curEs.fecha_inscripcion).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </li>
              </div>
            ))}
          </>
        )}
      </ul>
    </>
  )
}

export default TableCursosResultadosExamenEstudiante
