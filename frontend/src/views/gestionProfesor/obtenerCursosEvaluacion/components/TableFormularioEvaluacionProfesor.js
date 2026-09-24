const FormularioEvaluacion = ({
  cursoActual,
  datosExamen,
  setDatosExamen,
  crearEvaluacionDeunCurso,
  editarEvaluacionDeunCurso,
  editarExamenCursoSeleccionada,
  setEditarExamenCursoSeleccionada,
  setCursoCrearExamenSeleccionado,
}) => {
  const esEditar = editarExamenCursoSeleccionada !== null

  return (
    <div className="evaluacion-form__panel">
      <h1 className="evaluacion-form__title">
        {esEditar ? 'Editar evaluación' : 'Crear evaluación'} para el curso: {cursoActual.curso}
      </h1>

      <div className="evaluacion-form__field">
        <label htmlFor="formulario-nombre-evaluacion">Nombre de evaluacion</label>
        <input
          type="text"
          id="formulario-nombre-evaluacion"
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
        <label htmlFor="formulario-descripcion-evaluacion">Descripción</label>
        <textarea
          id="formulario-descripcion-evaluacion"
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
        <label htmlFor="formulario-fecha-evaluacion">Fecha de evaluacion</label>
        <input
          type="date"
          id="formulario-fecha-evaluacion"
          aria-label="Fecha de evaluación"
          className="evaluacion-form__input"
          value={datosExamen.fechaEvaluacion}
          onChange={(e) => {
            setDatosExamen({
              ...datosExamen,
              fechaEvaluacion: e.target.value,
            })
          }}
        />
      </div>

      <div className="evaluacion-form__field">
        <label htmlFor="formulario-porcentaje-evaluacion">Porcentaje de examen</label>
        <input
          type="text"
          id="formulario-porcentaje-evaluacion"
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

      <div className="evaluacion-form__actions">
        {esEditar ? (
          <button
            className="btn btn-primary"
            onClick={() =>
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
            Actualizar
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() =>
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
        )}

        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            setCursoCrearExamenSeleccionado(null)
            setEditarExamenCursoSeleccionada(null)
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default FormularioEvaluacion
