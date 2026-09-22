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
    <>
      <div className="reporte">
        <p>
          <strong>Cursos:</strong>
        </p>
        {cursosUnicos.length > 0 ? (
          <ul>
            {cursosUnicos.map((curso, index) => (
              <li key={`${curso}-${index}`}>{curso}</li>
            ))}
          </ul>
        ) : (
          <p>No hay cursos asignados</p>
        )}
        <p>
          <strong>Total de estudiantes:</strong> {totalEstudiantes}
        </p>

        {datos.length > 0 ? (
          <table border="1" width="100%">
            <thead>
              <tr>
                <th>Nro</th>
                <th>Estudiante</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Fecha de inscripción</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((dat, index) => {
                const esPrimeroDelCurso = index === 0 || dat.curso !== datos[index - 1].curso
                return (
                  <Fragment key={dat.id_inscripcion || index}>
                    {esPrimeroDelCurso && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center' }}>
                          <strong>{dat.curso || 'No hay cursos asignados'}</strong>
                        </td>
                      </tr>
                    )}
                    {dat.estudiante && (
                      <tr>
                        <td>#{index + 1}</td>
                        <td>{dat.estudiante}</td>
                        <td>{dat.telefono_estudiante || '---'}</td>
                        <td>{dat.direccion || '---'}</td>
                        <td>
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
        ) : (
          <p>No hay estudiantes asignados</p>
        )}
      </div>
    </>
  )
}

export default TableEstudianteProfesor
