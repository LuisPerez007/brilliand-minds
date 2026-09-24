import '../../../../scss/contenedorStyles/contenedores.scss'
import '../../../../scss/textoStyles/textos.scss'
import '../../../../scss/formaStyles/selectStyle.scss'
import '../../../../scss/formaStyles/buttonStyle.scss'

const TableCursoProfesor = ({ cursosProfesor }) => {
  return (
    <div className="table-responsive table-profesor__wrapper">
      <table className="table table-profesor__table">
        <thead>
          <tr>
            <th className="table-profesor__head">Cursos</th>
            <th className="table-profesor__head">Descripción</th>
            <th className="table-profesor__head">Duración</th>
            <th className="table-profesor__head">Fecha inicio</th>
            <th className="table-profesor__head">Fecha final</th>
            <th className="table-profesor__head table-profesor__head--center">
              Total de Estudiantes
            </th>
          </tr>
        </thead>

        <tbody>
          {cursosProfesor.length === 0 ? (
            <>
              <tr>
                <td className="table-profesor__cell table-profesor__cell--empty" colSpan="6">
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
                <tr key={curPro.id_curso} className="table-profesor__row">
                  <td className="table-profesor__cell">{curPro.materia}</td>
                  <td className="table-profesor__cell">{curPro.descripcion}</td>
                  <td className="table-profesor__cell">
                    {valor ? `${valor} ${unidad}` : 'Sin duración'}
                  </td>
                  <td className="table-profesor__cell">
                    {curPro.fecha_creacion
                      ? new Date(curPro.fecha_creacion).toLocaleDateString()
                      : '---'}
                  </td>
                  <td className="table-profesor__cell">
                    {curPro.fecha_fin ? new Date(curPro.fecha_fin).toLocaleDateString() : '---'}
                  </td>
                  <td className="table-profesor__cell table-profesor__cell--center">
                    {curPro.cantidad_estudiantes}
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TableCursoProfesor
