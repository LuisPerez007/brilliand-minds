import '../../../../scss/contenedorStyles/contenedores.scss'
import '../../../../scss/textoStyles/textos.scss'
import '../../../../scss/formaStyles/selectStyle.scss'
import '../../../../scss/formaStyles/buttonStyle.scss'

const TableCursoProfesor = ({ cursosProfesor }) => {
  return (
    <>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Cursos</th>
            <th>Descripción</th>
            <th>Duración</th>
            <th>Fecha inicio</th>
            <th>Fecha final</th>
            <th>Total de Estudiantes</th>
          </tr>
        </thead>

        <tbody>
          {cursosProfesor.length === 0 ? (
            <>
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  No hay cursos asignados
                </td>
              </tr>
            </>
          ) : (
            cursosProfesor.map((curPro) => {
              const unidad =
                curPro.duracion && typeof curPro.duracion === 'object'
                  ? Object.keys(curPro.duracion)[0]
                  : null

              const valor = unidad ? curPro.duracion[unidad] : null

              return (
                <tr key={curPro.id_curso}>
                  <td>{curPro.materia}</td>
                  <td>{curPro.descripcion}</td>
                  <td>{valor ? `${valor} ${unidad}` : 'Sin duración'}</td>
                  <td>
                    {curPro.fecha_creacion
                      ? new Date(curPro.fecha_creacion).toLocaleDateString()
                      : '---'}
                  </td>
                  <td>
                    {curPro.fecha_fin ? new Date(curPro.fecha_fin).toLocaleDateString() : '---'}
                  </td>
                  <td>{curPro.cantidad_estudiantes}</td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </>
  )
}

export default TableCursoProfesor
