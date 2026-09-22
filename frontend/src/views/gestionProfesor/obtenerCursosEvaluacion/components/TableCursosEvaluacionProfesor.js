import '../../../../scss/contenedorStyles/contenedores.scss'
import '../../../../scss/textoStyles/textos.scss'
import '../../../../scss/formaStyles/selectStyle.scss'
import '../../../../scss/formaStyles/buttonStyle.scss'
import { generarReporteCalificacionesPdf } from '../../../utils/generarReporteCalificacionesPdf'

const TableCursosEvaluacionProfesor = ({
  cursoEvaluacionProfesor,
  evaluacionesCurso,
  mostrarEvaluacionesDeunCurso,
  cursoSeleccionado,
  setCursoSeleccionado,
  listaCalificacion,
  cargandoCalificaciones,
  setListaCalificacion,
  cargarListaCalificaciones,
  evaluacionSeleccionada,
  setEvaluacionSeleccionada,
  registrarCalificacion,
  editarCalificacion,
  calificacionEditando,
  setCalificacionEditando,
  cursoCrearExamenSelecionado,
  setCursoCrearExamenSeleccionado,
  crearEvaluacionDeunCurso,
  datosExamen,
  setDatosExamen,
  editarExamenCursoSeleccionada,
  setEditarExamenCursoSeleccionada,
  editarEvaluacionDeunCurso,
  eliminarEvaluacionDeunCurso,
}) => {
  const cursoActual = (cursoEvaluacionProfesor ?? []).find(
    (curso) => curso.id_curso === cursoSeleccionado,
  )
  const estudiantesAprobados = (listaCalificacion ?? []).filter(
    (estudiantes) => estudiantes.nota > 50,
  ).length
  const estudiantesReprobados = (listaCalificacion ?? []).filter(
    (estudiantes) => Number.isFinite(Number(estudiantes.nota)) && Number(estudiantes.nota) <= 50,
  ).length
  const estudiantesSinCalificar = (listaCalificacion ?? []).filter(
    (estudiante) =>
      estudiante.nota === null ||
      estudiante.nota === undefined ||
      estudiante.nota === '' ||
      !Number.isFinite(Number(estudiante.nota)) ||
      Number(estudiante.nota) < 0 ||
      Number(estudiante.nota) > 100,
  ).length
  const imprimirReporteCalificaciones = () => {
    if (cargandoCalificaciones) {
      alert('La lista todavía está cargando. Espere un momento antes de imprimir.')
      return
    }
    if (listaCalificacion.length === 0) {
      alert('No hay estudiantes inscritos para generar el reporte.')
      return
    }
    if (calificacionEditando !== null) {
      alert('Debe terminar o cancelar la calificación en edición antes de imprimir.')
      return
    }
    const datosValidos = listaCalificacion[0]
    if (!datosValidos?.curso || !datosValidos?.profesor || !datosValidos?.evaluacion) {
      alert('No hay datos válidos de curso, profesor o evaluación para generar el reporte.')
      return
    }
    if (estudiantesSinCalificar > 0) {
      alert('No se puede generar el reporte porque existen estudiantes sin calificación válida.')
      return
    }

    generarReporteCalificacionesPdf({
      datos: listaCalificacion,
      aprobados: estudiantesAprobados,
      reprobados: estudiantesReprobados,
    })
  }
  return (
    <>
      {cursoSeleccionado === null ? (
        <div>
          <h1>Calificaciones de los cursos</h1>
          <ul>
            {cursoEvaluacionProfesor.length === 0 ? (
              <p>No hay cursos asignados</p>
            ) : (
              cursoEvaluacionProfesor.map((curso) => (
                <li key={curso.id_curso}>
                  <span style={{ display: 'inline-block', width: '180px' }}>{curso.curso} </span>
                  <button onClick={() => mostrarEvaluacionesDeunCurso(curso.id_curso)}>
                    Calificaciones
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : evaluacionSeleccionada === null ? (
        <>
          {editarExamenCursoSeleccionada ? (
            <div>
              <p>
                <strong>Actualizar la evaluación:</strong>{' '}
                {editarExamenCursoSeleccionada.nombre_evaluacion}
                <br />
                <strong>Del:</strong> {editarExamenCursoSeleccionada.curso}
              </p>
              <div>
                <label htmlFor="editar-nombre-evaluacion">Nombre de evaluacion</label>
                <br />
                <input
                  type="text"
                  id="editar-nombre-evaluacion"
                  aria-label="Nombre de evaluación"
                  value={datosExamen.nombreEvaluacion}
                  onChange={(e) => {
                    setDatosExamen({
                      ...datosExamen,
                      nombreEvaluacion: e.target.value,
                    })
                  }}
                />
              </div>
              <div>
                <label htmlFor="editar-descripcion-evaluacion">Descripción</label>
                <br />
                <textarea
                  id="editar-descripcion-evaluacion"
                  aria-label="Descripción de evaluación"
                  type="text"
                  value={datosExamen.descripcion}
                  onChange={(e) => {
                    setDatosExamen({
                      ...datosExamen,
                      descripcion: e.target.value,
                    })
                  }}
                />
              </div>
              <div>
                <label htmlFor="editar-fecha-evaluacion">Fecha de evaluacion</label>
                <br />
                <input
                  type="date"
                  id="editar-fecha-evaluacion"
                  aria-label="Fecha de evaluación"
                  value={datosExamen.fechaEvaluacion?.slice(0, 10)}
                  onChange={(e) => {
                    setDatosExamen({
                      ...datosExamen,
                      fechaEvaluacion: e.target.value,
                    })
                  }}
                />
              </div>
              <div>
                <label htmlFor="editar-porcentaje-evaluacion">Porcentaje de examen</label>
                <br />
                <input
                  type="text"
                  id="editar-porcentaje-evaluacion"
                  aria-label="Porcentaje de examen"
                  value={datosExamen.porcentaje}
                  onChange={(e) => {
                    setDatosExamen({
                      ...datosExamen,
                      porcentaje: e.target.value,
                    })
                  }}
                />
              </div>
              <br />
              <button
                onClick={async () =>
                  editarEvaluacionDeunCurso(
                    editarExamenCursoSeleccionada.id_evaluacion,
                    cursoActual.id_curso,
                    datosExamen.nombreEvaluacion,
                    datosExamen.descripcion,
                    datosExamen.fechaEvaluacion,
                    datosExamen.porcentaje,
                  )
                }
              >
                Guardar
              </button>
              <button onClick={() => setEditarExamenCursoSeleccionada(null)}>Cancelar</button>
            </div>
          ) : cursoCrearExamenSelecionado ? (
            <>
              <h1>Crear evaluación para el curso: {cursoActual.curso}</h1>
              <div>
                <label htmlFor="crear-nombre-evaluacion">Nombre de evaluacion</label>
                <br />
                <input
                  type="text"
                  id="crear-nombre-evaluacion"
                  aria-label="Nombre de evaluación"
                  value={datosExamen.nombreEvaluacion}
                  placeholder={datosExamen.nombreEvaluacion}
                  onChange={(e) => {
                    setDatosExamen({
                      ...datosExamen,
                      nombreEvaluacion: e.target.value,
                    })
                  }}
                />
              </div>
              <div>
                <label htmlFor="crear-descripcion-evaluacion">Descripción</label>
                <br />
                <textarea
                  type="text"
                  id="crear-descripcion-evaluacion"
                  aria-label="Descripción de evaluación"
                  value={datosExamen.descripcion}
                  placeholder={datosExamen.descripcion}
                  onChange={(e) => {
                    setDatosExamen({
                      ...datosExamen,
                      descripcion: e.target.value,
                    })
                  }}
                />
              </div>
              <div>
                <label htmlFor="crear-fecha-evaluacion">Fecha de evaluacion</label>
                <br />
                <input
                  type="date"
                  id="crear-fecha-evaluacion"
                  aria-label="Fecha de evaluación"
                  value={datosExamen.fechaEvaluacion}
                  placeholder={datosExamen.fechaEvaluacion}
                  onChange={(e) => {
                    setDatosExamen({
                      ...datosExamen,
                      fechaEvaluacion: e.target.value,
                    })
                  }}
                />
              </div>
              <div>
                <label htmlFor="crear-porcentaje-evaluacion">Porcentaje de examen</label>
                <br />
                <input
                  type="text"
                  id="crear-porcentaje-evaluacion"
                  aria-label="Porcentaje de examen"
                  value={datosExamen.porcentaje}
                  placeholder={datosExamen.porcentaje}
                  onChange={(e) => {
                    setDatosExamen({
                      ...datosExamen,
                      porcentaje: e.target.value,
                    })
                  }}
                />
              </div>
              <br />
              <button
                onClick={async () =>
                  crearEvaluacionDeunCurso(
                    cursoActual.id_curso,
                    datosExamen.nombreEvaluacion,
                    datosExamen.descripcion,
                    datosExamen.fechaEvaluacion,
                    datosExamen.porcentaje,
                  )
                }
              >
                Guardar
              </button>
              <button onClick={() => setCursoCrearExamenSeleccionado(null)}>Cancelar</button>
            </>
          ) : (
            <div>
              <h1>Calificando curso: {cursoActual?.curso}</h1>
              <button onClick={() => setCursoCrearExamenSeleccionado(cursoActual.id_curso)}>
                Crear Examen
              </button>
              <ul>
                {evaluacionesCurso.length === 0 ? (
                  <p>No hay exámenes para este curso.</p>
                ) : (
                  evaluacionesCurso.map((evaCu) => (
                    <li key={evaCu.id_evaluacion}>
                      <span style={{ display: 'inline-block', width: '200px' }}>
                        {evaCu.porcentaje}% {evaCu.nombre_evaluacion}{' '}
                      </span>
                      <button
                        onClick={() =>
                          cargarListaCalificaciones(cursoSeleccionado, evaCu.id_evaluacion)
                        }
                      >
                        Calificar
                      </button>{' '}
                      <button
                        onClick={() => {
                          setEditarExamenCursoSeleccionada(evaCu)
                          setDatosExamen({
                            nombreEvaluacion: evaCu.nombre_evaluacion ?? '',
                            descripcion: evaCu.descripcion ?? '',
                            fechaEvaluacion: evaCu.fecha_evaluacion
                              ? evaCu.fecha_evaluacion.slice(0, 10)
                              : '',
                            porcentaje: evaCu.porcentaje ?? '',
                          })
                        }}
                      >
                        Editar
                      </button>{' '}
                      <button
                        onClick={() =>
                          eliminarEvaluacionDeunCurso(evaCu.id_curso, evaCu.id_evaluacion)
                        }
                      >
                        Eliminar
                      </button>
                    </li>
                  ))
                )}
              </ul>
              <button onClick={() => setCursoSeleccionado(null)}>Atras</button>
            </div>
          )}
        </>
      ) : (
        <div className="reporte">
          <h1 style={{ textAlign: 'center' }}>CALIFICACIONES</h1>
          <p>
            <strong>Profesor:</strong>{' '}
            {listaCalificacion?.[0]?.profesor || 'No hay estudiantes inscritos'}
          </p>
          <p>
            <strong>Curso:</strong>{' '}
            {listaCalificacion?.[0]?.curso || 'No hay estudiantes inscritos'}
          </p>
          <p>
            <strong>Evaluación:</strong>{' '}
            {listaCalificacion?.[0]?.evaluacion || 'No hay estudiantes inscritos'}
          </p>
          <p>
            <strong> Aprobados:</strong> {estudiantesAprobados || '0'}
            <strong> Reprobados:</strong> {estudiantesReprobados || '0'}
          </p>
          <p></p>
          <p>
            <strong>Descripción:</strong>{' '}
            {listaCalificacion?.[0]?.descripcion || 'No hay estudiantes inscritos'}
          </p>
          <p>
            <strong>Fecha de examen:</strong>
            {listaCalificacion?.[0]?.fecha_evaluacion
              ? new Date(listaCalificacion[0].fecha_evaluacion).toLocaleDateString()
              : 'No hay estudiantes inscritos'}
          </p>
          <p>
            <strong>Ponderación:</strong> {listaCalificacion?.[0]?.porcentaje}%
          </p>
          <button className="no-print" onClick={() => setEvaluacionSeleccionada(null)}>
            atras
          </button>
          <button
            className="no-print boton boton-cierre-eliminar"
            onClick={imprimirReporteCalificaciones}
            disabled={cargandoCalificaciones}
          >
            {cargandoCalificaciones ? 'Cargando...' : 'Imprimir reporte'}
          </button>
          <br />
          <table border="1px" width="100%">
            <thead>
              <tr>
                <th>N°</th>
                <th>Estudiante</th>
                <th>Nota</th>
                <th>Observacion</th>
                <th className="no-print">Acción</th>
              </tr>
            </thead>
            <tbody>
              {listaCalificacion.length === 0 ? (
                <>
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      No hay estudiantes inscritos
                    </td>
                  </tr>
                </>
              ) : (
                listaCalificacion.map((lista, index) => (
                  <tr key={lista.id_estudiante}>
                    <td>#{index + 1}</td>
                    <td>{lista.estudiante}</td>
                    {lista.id_calificacion ? (
                      calificacionEditando === lista.id_calificacion ? (
                        <>
                          <td>
                            <input
                              type="Number"
                              aria-label={`Nota de ${lista.estudiante}`}
                              min="0"
                              max="100"
                              step="0.01"
                              value={lista.nota ?? ''}
                              onChange={(e) => {
                                const nuevaLista = [...listaCalificacion]
                                nuevaLista[index].nota =
                                  e.target.value === '' ? null : Number(e.target.value)
                                setListaCalificacion(nuevaLista)
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              aria-label={`Observación de ${lista.estudiante}`}
                              value={lista.observacion ?? ''}
                              onChange={(e) => {
                                const nuevaLista = [...listaCalificacion]
                                nuevaLista[index].observacion = e.target.value
                                setListaCalificacion(nuevaLista)
                              }}
                            />
                          </td>
                          <td className="no-print">
                            <button
                              onClick={() => {
                                editarCalificacion(
                                  lista.id_curso,
                                  lista.id_evaluacion,
                                  lista.id_inscripcion,
                                  lista.id_calificacion,
                                  lista.nota,
                                  lista.observacion?.trim(),
                                  lista.id_estudiante,
                                )
                                setCalificacionEditando(null)
                              }}
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => {
                                setCalificacionEditando(null)
                              }}
                            >
                              Cancelar
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{lista.nota}</td>
                          <td>{lista.observacion}</td>
                          <td className="no-print">
                            <button onClick={() => setCalificacionEditando(lista.id_calificacion)}>
                              Editar
                            </button>
                          </td>
                        </>
                      )
                    ) : (
                      <>
                        <td>
                          <input
                            type="Number"
                            aria-label={`Nota de ${lista.estudiante}`}
                            min="0"
                            max="100"
                            step="0.01"
                            value={lista.nota ?? ''}
                            onChange={(e) => {
                              const nuevaLista = [...listaCalificacion]
                              nuevaLista[index].nota =
                                e.target.value === '' ? null : Number(e.target.value)
                              setListaCalificacion(nuevaLista)
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            aria-label={`Observación de ${lista.estudiante}`}
                            value={lista.observacion ?? ''}
                            onChange={(e) => {
                              const nuevaLista = [...listaCalificacion]
                              nuevaLista[index].observacion = e.target.value
                              setListaCalificacion(nuevaLista)
                            }}
                          />
                        </td>
                        <td className="no-print">
                          <button
                            onClick={() => {
                              registrarCalificacion(
                                lista.id_curso,
                                lista.id_evaluacion,
                                lista.id_inscripcion,
                                lista.nota,
                                lista.observacion?.trim(),
                                lista.id_estudiante,
                              )
                            }}
                          >
                            calificar
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <strong>Resumen académico:</strong>{' '}
          <p>
            De un total de {(listaCalificacion ?? []).length} estudiantes evaluados en la materia de{' '}
            {listaCalificacion?.[0]?.curso ?? 'No hay inscripciones'}, {estudiantesAprobados ?? 0}{' '}
            {estudiantesAprobados === 1 ? 'estudiante obtuvo' : 'estudiantes obtuvieron'} una
            calificación superior a 50 puntos y aprobaron la evaluación, mientras que{' '}
            {estudiantesReprobados ?? 0}{' '}
            {estudiantesReprobados === 1 ? 'estudiante no alcanzó' : 'estudiantes no alcanzaron'} la
            calificación mínima requerida.
          </p>
        </div>
      )}
    </>
  )
}

export default TableCursosEvaluacionProfesor
