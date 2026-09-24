import { Fragment } from 'react'

import '../../../../scss/contenedorStyles/contenedores.scss'
import '../../../../scss/textoStyles/textos.scss'
import '../../../../scss/formaStyles/selectStyle.scss'
import '../../../../scss/formaStyles/buttonStyle.scss'

const TableEstudianteProfesor = ({ estudianteProfesor }) => {
  const datos = estudianteProfesor || []

  const cursosUnicos = [...new Set(datos.map((dat) => dat.curso || 'No hay cursos asignados'))]

  const totalEstudiantes = datos.filter((dat) => dat.estudiante !== null).length

  return (
    <div className="estudiantes-profesor__report">
      <div className="estudiantes-profesor__stats">
        <div className="estudiantes-profesor__stat">
          <span className="estudiantes-profesor__label">Cursos</span>
          {cursosUnicos.length > 0 ? (
            <ul className="estudiantes-profesor__list">
              {cursosUnicos.map((curso, index) => (
                <li key={`${curso}-${index}`}>{curso}</li>
              ))}
            </ul>
          ) : (
            <p className="estudiantes-profesor__empty">No hay cursos asignados</p>
          )}
        </div>

        <div className="estudiantes-profesor__stat estudiantes-profesor__stat--total">
          <span className="estudiantes-profesor__label">Total de estudiantes</span>
          <strong>{totalEstudiantes}</strong>
        </div>
      </div>

      {datos.length > 0 ? (
        <div className="table-responsive table-estudiantes-profesor__wrapper">
          <table className="table table-estudiantes-profesor__table">
            <thead>
              <tr>
                <th className="table-estudiantes-profesor__head">Nro</th>
                <th className="table-estudiantes-profesor__head">Estudiante</th>
                <th className="table-estudiantes-profesor__head">Teléfono</th>
                <th className="table-estudiantes-profesor__head">Dirección</th>
                <th className="table-estudiantes-profesor__head">Fecha de inscripción</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((dat, index) => {
                const esPrimeroDelCurso = index === 0 || dat.curso !== datos[index - 1].curso
                return (
                  <Fragment key={dat.id_inscripcion || index}>
                    {esPrimeroDelCurso && (
                      <tr className="table-estudiantes-profesor__group-row">
                        <td className="table-estudiantes-profesor__group-cell" colSpan="5">
                          <strong>{dat.curso || 'No hay cursos asignados'}</strong>
                        </td>
                      </tr>
                    )}
                    {dat.estudiante && (
                      <tr className="table-estudiantes-profesor__row">
                        <td className="table-estudiantes-profesor__cell">#{index + 1}</td>
                        <td className="table-estudiantes-profesor__cell">{dat.estudiante}</td>
                        <td className="table-estudiantes-profesor__cell">
                          {dat.telefono_estudiante || '---'}
                        </td>
                        <td className="table-estudiantes-profesor__cell">
                          {dat.direccion || '---'}
                        </td>
                        <td className="table-estudiantes-profesor__cell">
                          {dat.fecha_inscripcion
                            ? new Date(dat.fecha_inscripcion).toLocaleDateString()
                            : '---'}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="estudiantes-profesor__empty">No hay estudiantes asignados</p>
      )}
    </div>
  )
}

export default TableEstudianteProfesor
