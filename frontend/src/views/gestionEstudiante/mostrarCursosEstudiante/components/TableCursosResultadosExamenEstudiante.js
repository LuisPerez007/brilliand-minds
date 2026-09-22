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
      <ul>
        {cursosEstudiante.length === 0 ? (
          <>
            <h1>No esta inscrito en ningun curso</h1>
          </>
        ) : calificacionesDeunCurso.length !== 0 ? (
          <>
            <h1>Mostrando examenes del curso: {calificacionesDeunCurso[0].materia}</h1>
            <table border="1px" width="100%">
              <thead>
                <tr>
                  <th>Nombre de Evaluacion</th>
                  <th>fecha de examen</th>
                  <th>Obsercación</th>
                  <th>Nota</th>
                  <th>Ponderación</th>
                  <th>Calificación total</th>
                </tr>
              </thead>
              <tbody>
                {calificacionesDeunCurso.map((calCur) => (
                  <tr key={calCur.id_evaluacion}>
                    <td>{calCur.nombre_evaluacion}</td>
                    <td>{new Date(calCur.fecha_evaluacion).toLocaleDateString()}</td>
                    <td>{calCur.observacion}</td>
                    <td>{Math.round(calCur.nota)}</td>
                    <td>{calCur.porcentaje}%</td>
                    <td>{Math.round((calCur.nota * calCur.porcentaje) / 100)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4}></td>
                  <td>
                    <strong>Notal Final</strong>
                  </td>
                  <td
                    style={{
                      backgroundColor: notaFinal > 50 ? 'green' : 'red',
                      textAlign: 'center',
                    }}
                  >
                    {notaFinal}
                  </td>
                </tr>
              </tbody>
            </table>
            <button onClick={() => setCalificacionesDeunCurso([])}>atras</button>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center' }}>
              <h1>HISTORIAL ACADEMICO</h1>
              <p>Cursos y rendimiento por período</p>
            </div>

            {cursosEstudiante.map((curEs, index) => (
              <div key={curEs.id_curso}>
                {index === 0 || cursosEstudiante[index - 1].periodo !== curEs.periodo ? (
                  <>
                    <h1>
                      Periodo: <small>{curEs.periodo}</small>
                    </h1>
                  </>
                ) : null}
                <li>
                  <div>
                    <span style={{ display: 'inline-block', width: '180px' }}>{curEs.materia}</span>
                    <button
                      onClick={() => {
                        cargarCalificacionesDeunCursoEstudiante(curEs.id_curso)
                      }}
                    >
                      Ver notas
                    </button>
                    <p>
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
