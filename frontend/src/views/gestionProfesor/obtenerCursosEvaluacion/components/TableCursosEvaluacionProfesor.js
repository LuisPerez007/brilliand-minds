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
    <div className="evaluacion-profesor__container">
      {cursoSeleccionado === null ? (
        <div className="evaluacion-profesor__panel">
          <h1 className="evaluacion-profesor__title">Calificaciones de los cursos</h1>
          <ul className="evaluacion-cursos__list">
            {cursoEvaluacionProfesor.length === 0 ? (
              <p className="evaluacion-profesor__empty">No hay cursos asignados</p>
            ) : (
              cursoEvaluacionProfesor.map((curso) => (
                <li key={curso.id_curso} className="evaluacion-cursos__item">
                  <span className="evaluacion-cursos__course-name">{curso.curso}</span>
                  <button
                    className="btn btn-primary evaluacion-cursos__button"
                    onClick={() => mostrarEvaluacionesDeunCurso(curso.id_curso)}
                  >
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
            <div className="evaluacion-form__panel">
              <div className="mb-4 p-3 rounded-3 bg-light border border-light-subtle app-meta-box">
                <p className="m-0 text-secondary fw-medium">
                  <strong className="text-body d-block mb-1 fs-5">
                    Actualizar la evaluación:{' '}
                    <span className="text-primary">
                      {editarExamenCursoSeleccionada.nombre_evaluacion}
                    </span>
                  </strong>
                  <strong>Del curso:</strong> {editarExamenCursoSeleccionada.curso}
                </p>
              </div>

              <div className="evaluacion-form__field">
                <label htmlFor="editar-nombre-evaluacion">Nombre de evaluacion</label>
                <input
                  type="text"
                  id="editar-nombre-evaluacion"
                  aria-label="Nombre de evaluación"
                  className="evaluacion-form__input"
                  value={datosExamen.nombreEvaluacion}
                  onChange={(e) => {
                    setDatosExamen({
                      ...datosExamen,
                      nombreEvaluacion: e.target.value,
                    })
                  }}
                />
              </div>

              <div className="evaluacion-form__field">
                <label htmlFor="editar-descripcion-evaluacion">Descripción</label>
                <textarea
                  id="editar-descripcion-evaluacion"
                  aria-label="Descripción de evaluación"
                  className="evaluacion-form__textarea evaluacion-form__input"
                  value={datosExamen.descripcion}
                  onChange={(e) => {
                    setDatosExamen({
                      ...datosExamen,
                      descripcion: e.target.value,
                    })
                  }}
                />
              </div>

              <div className="evaluacion-form__field">
                <label htmlFor="editar-fecha-evaluacion">Fecha de evaluacion</label>
                <input
                  type="date"
                  id="editar-fecha-evaluacion"
                  aria-label="Fecha de evaluación"
                  className="evaluacion-form__input"
                  value={datosExamen.fechaEvaluacion?.slice(0, 10)}
                  onChange={(e) => {
                    setDatosExamen({
                      ...datosExamen,
                      fechaEvaluacion: e.target.value,
                    })
                  }}
                />
              </div>

              <div className="evaluacion-form__field">
                <label htmlFor="editar-porcentaje-evaluacion">Porcentaje de examen</label>
                <input
                  type="text"
                  id="editar-porcentaje-evaluacion"
                  aria-label="Porcentaje de examen"
                  className="evaluacion-form__input"
                  value={datosExamen.porcentaje}
                  onChange={(e) => {
                    setDatosExamen({
                      ...datosExamen,
                      porcentaje: e.target.value,
                    })
                  }}
                />
              </div>

              <div className="evaluacion-form__actions mt-4 pt-2">
                <button
                  className="btn btn-primary fw-bold"
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
                <button
                  className="btn btn-outline-secondary fw-semibold"
                  onClick={() => setEditarExamenCursoSeleccionada(null)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : cursoCrearExamenSelecionado ? (
            <div className="evaluacion-form__panel">
              <h1 className="evaluacion-form__title mb-4">
                Crear evaluación para el curso:{' '}
                <span className="text-primary">{cursoActual.curso}</span>
              </h1>

              <div className="evaluacion-form__field">
                <label htmlFor="crear-nombre-evaluacion">Nombre de evaluacion</label>
                <input
                  type="text"
                  id="crear-nombre-evaluacion"
                  aria-label="Nombre de evaluación"
                  className="evaluacion-form__input"
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

              <div className="evaluacion-form__field">
                <label htmlFor="crear-descripcion-evaluacion">Descripción</label>
                <textarea
                  id="crear-descripcion-evaluacion"
                  aria-label="Descripción de evaluación"
                  className="evaluacion-form__textarea evaluacion-form__input"
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

              <div className="evaluacion-form__field">
                <label htmlFor="crear-fecha-evaluacion">Fecha de evaluacion</label>
                <input
                  type="date"
                  id="crear-fecha-evaluacion"
                  aria-label="Fecha de evaluación"
                  className="evaluacion-form__input"
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

              <div className="evaluacion-form__field">
                <label htmlFor="crear-porcentaje-evaluacion">Porcentaje de examen</label>
                <input
                  type="text"
                  id="crear-porcentaje-evaluacion"
                  aria-label="Porcentaje de examen"
                  className="evaluacion-form__input"
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

              <div className="evaluacion-form__actions mt-4 pt-2">
                <button
                  className="btn btn-primary fw-bold"
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
                <button
                  className="btn btn-outline-secondary fw-semibold"
                  onClick={() => setCursoCrearExamenSeleccionado(null)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="evaluacion-form__panel">
              {/* Cabecera y Botón de Acción Principal */}
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <h1 className="evaluacion-form__title m-0">
                  Calificando curso: <span className="text-primary">{cursoActual?.curso}</span>
                </h1>
                <button
                  className="btn btn-primary"
                  onClick={() => setCursoCrearExamenSeleccionado(cursoActual.id_curso)}
                >
                  Crear Examen
                </button>
              </div>

              {/* Contenedor de la lista */}
              <div className="evaluacion-form__section">
                {evaluacionesCurso.length === 0 ? (
                  <p className="evaluacion-profesor__empty text-center py-4 bg-light rounded-3 border border-dashed fw-medium m-0">
                    No hay exámenes para este curso.
                  </p>
                ) : (
                  <ul className="evaluacion-form__list list-unstyled m-0 d-flex flex-column gap-2">
                    {evaluacionesCurso.map((evaCu) => (
                      <li
                        key={evaCu.id_evaluacion}
                        className="evaluacion-form__item d-flex align-items-center justify-content-between p-3 rounded-3"
                      >
                        {/* Información del Examen */}
                        <div className="evaluacion-form__item-info d-flex align-items-center gap-3">
                          <span
                            className="evaluacion-form__item-name fw-semibold"
                            style={{ display: 'inline-block', minWidth: '200px' }}
                          >
                            <span className="badge bg-primary-soft text-primary me-2 px-2 py-1.5 rounded-pill fw-bold border border-primary-subtle">
                              {evaCu.porcentaje}%
                            </span>
                            {evaCu.nombre_evaluacion}
                          </span>
                        </div>

                        {/* Grupo de Botones de Control */}
                        <div className="evaluacion-form__item-actions d-flex flex-wrap gap-2">
                          <button
                            className="btn btn-sm btn-primary fw-bold"
                            onClick={() =>
                              cargarListaCalificaciones(cursoSeleccionado, evaCu.id_evaluacion)
                            }
                          >
                            Calificar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
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
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              eliminarEvaluacionDeunCurso(evaCu.id_curso, evaCu.id_evaluacion)
                            }
                          >
                            Eliminar
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Botón de Retorno Inferior */}
              <div className="evaluacion-form__footer mt-4 pt-3 border-top">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setCursoSeleccionado(null)}
                >
                  Atras
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="evaluacion-profesor__panel evaluacion-profesor__panel--report">
          <h1 className="evaluacion-profesor__title evaluacion-profesor__title--center">
            CALIFICACIONES
          </h1>
          <div className="evaluacion-profesor__panel mb-4">
            <div className="row g-3 ">
              <div className="col-12 col-md-6 d-flex flex-column gap-2">
                <p className="m-0 text-secondary">
                  <strong className="text-body">Profesor:</strong>{' '}
                  {listaCalificacion?.[0]?.profesor || 'No hay estudiantes inscritos'}
                </p>
                <p className="m-0 text-secondary">
                  <strong className="text-body">Curso:</strong>{' '}
                  {listaCalificacion?.[0]?.curso || 'No hay estudiantes inscritos'}
                </p>
                <p className="m-0 text-secondary">
                  <strong className="text-body">Evaluación:</strong>{' '}
                  {listaCalificacion?.[0]?.evaluacion || 'No hay estudiantes inscritos'}
                </p>
                <p className="m-0 d-flex gap-2 align-items-center flex-wrap">
                  <span className="badge bg-success-soft text-success border border-success-subtle px-2 py-1.5 rounded-pill fw-bold">
                    Aprobados: {estudiantesAprobados || '0'}
                  </span>
                  <span className="badge bg-danger-soft text-danger border border-danger-subtle px-2 py-1.5 rounded-pill fw-bold">
                    Reprobados: {estudiantesReprobados || '0'}
                  </span>
                </p>
              </div>

              <div className="col-12 col-md-6 d-flex flex-column gap-2 border-start-md">
                <p className="m-0 text-secondary">
                  <strong className="text-body">Descripción:</strong>{' '}
                  {listaCalificacion?.[0]?.descripcion || 'No hay estudiantes inscritos'}
                </p>
                <p className="m-0 text-secondary">
                  <strong className="text-body">Fecha de examen:</strong>{' '}
                  {listaCalificacion?.[0]?.fecha_evaluacion
                    ? new Date(listaCalificacion[0].fecha_evaluacion).toLocaleDateString()
                    : 'No hay estudiantes inscritos'}
                </p>
                <p className="m-0 text-secondary">
                  <strong className="text-body">Ponderación:</strong>{' '}
                  <span className="fw-bold text-primary">
                    {listaCalificacion?.[0]?.porcentaje}%
                  </span>
                </p>
              </div>
            </div>

            <div className="evaluacion-profesor__actions d-flex justify-content-between align-items-center mt-4 pt-3 border-top flex-wrap gap-2">
              <button
                className="btn btn-outline-secondary no-print fw-semibold"
                onClick={() => setEvaluacionSeleccionada(null)}
              >
                atras
              </button>
              <button
                className="btn btn-primary no-print fw-bold px-4 d-inline-flex align-items-center gap-2"
                onClick={imprimirReporteCalificaciones}
                disabled={cargandoCalificaciones}
              >
                {cargandoCalificaciones ? (
                  <>
                    <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    <span>Cargando...</span>
                  </>
                ) : (
                  'Imprimir reporte'
                )}
              </button>
            </div>
          </div>
          <div className="table-responsive table-evaluacion__wrapper">
            <table className="table table-evaluacion__table">
              <thead>
                <tr>
                  <th className="table-evaluacion__head">N°</th>
                  <th className="table-evaluacion__head">Estudiante</th>
                  <th className="table-evaluacion__head">Nota</th>
                  <th className="table-evaluacion__head">Observacion</th>
                  <th className="table-evaluacion__head no-print">Acción</th>
                </tr>
              </thead>
              <tbody>
                {listaCalificacion.length === 0 ? (
                  <>
                    <tr>
                      <td
                        className="table-evaluacion__cell table-evaluacion__cell--empty"
                        colSpan="5"
                      >
                        No hay estudiantes inscritos
                      </td>
                    </tr>
                  </>
                ) : (
                  listaCalificacion.map((lista, index) => (
                    <tr key={lista.id_estudiante} className="table-evaluacion__row">
                      <td className="table-evaluacion__cell">#{index + 1}</td>
                      <td className="table-evaluacion__cell">{lista.estudiante}</td>
                      {lista.id_calificacion ? (
                        calificacionEditando === lista.id_calificacion ? (
                          <>
                            <td className="table-evaluacion__cell">
                              <input
                                type="Number"
                                aria-label={`Nota de ${lista.estudiante}`}
                                min="0"
                                max="100"
                                step="0.01"
                                value={lista.nota ?? ''}
                                className="evaluacion-form__input"
                                onChange={(e) => {
                                  const nuevaLista = [...listaCalificacion]
                                  nuevaLista[index].nota =
                                    e.target.value === '' ? null : Number(e.target.value)
                                  setListaCalificacion(nuevaLista)
                                }}
                              />
                            </td>
                            <td className="table-evaluacion__cell">
                              <input
                                type="text"
                                aria-label={`Observación de ${lista.estudiante}`}
                                value={lista.observacion ?? ''}
                                className="evaluacion-form__input"
                                onChange={(e) => {
                                  const nuevaLista = [...listaCalificacion]
                                  nuevaLista[index].observacion = e.target.value
                                  setListaCalificacion(nuevaLista)
                                }}
                              />
                            </td>
                            <td className="table-evaluacion__cell table-evaluacion__cell--action no-print">
                              <div className="evaluacion-profesor__inline-actions">
                                <button
                                  className="btn btn-primary btn-sm"
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
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => {
                                    setCalificacionEditando(null)
                                  }}
                                >
                                  Cancelar
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="table-evaluacion__cell">{lista.nota}</td>
                            <td className="table-evaluacion__cell">{lista.observacion}</td>
                            <td className="table-evaluacion__cell table-evaluacion__cell--action no-print">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => setCalificacionEditando(lista.id_calificacion)}
                              >
                                Editar
                              </button>
                            </td>
                          </>
                        )
                      ) : (
                        <>
                          <td className="table-evaluacion__cell">
                            <input
                              type="Number"
                              aria-label={`Nota de ${lista.estudiante}`}
                              min="0"
                              max="100"
                              step="0.01"
                              value={lista.nota ?? ''}
                              className="evaluacion-form__input"
                              onChange={(e) => {
                                const nuevaLista = [...listaCalificacion]
                                nuevaLista[index].nota =
                                  e.target.value === '' ? null : Number(e.target.value)
                                setListaCalificacion(nuevaLista)
                              }}
                            />
                          </td>
                          <td className="table-evaluacion__cell">
                            <input
                              type="text"
                              aria-label={`Observación de ${lista.estudiante}`}
                              value={lista.observacion ?? ''}
                              className="evaluacion-form__input"
                              onChange={(e) => {
                                const nuevaLista = [...listaCalificacion]
                                nuevaLista[index].observacion = e.target.value
                                setListaCalificacion(nuevaLista)
                              }}
                            />
                          </td>
                          <td className="table-evaluacion__cell table-evaluacion__cell--action no-print">
                            <button
                              className="btn btn-primary btn-sm"
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
          </div>
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
    </div>
  )
}

export default TableCursosEvaluacionProfesor
