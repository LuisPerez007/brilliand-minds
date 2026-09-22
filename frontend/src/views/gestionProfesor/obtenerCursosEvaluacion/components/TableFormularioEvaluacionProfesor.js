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
    <>
      <h1>
        {esEditar ? 'Editar evaluación' : 'Crear evaluación'} para el curso: {cursoActual.curso}
      </h1>

      <div>
        <label htmlFor="formulario-nombre-evaluacion">Nombre de evaluacion</label>
        <br />
        <input
          type="text"
          id="formulario-nombre-evaluacion"
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
        <label htmlFor="formulario-descripcion-evaluacion">Descripción</label>
        <br />
        <textarea
          id="formulario-descripcion-evaluacion"
          aria-label="Descripción de evaluación"
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
        <label htmlFor="formulario-fecha-evaluacion">Fecha de evaluacion</label>
        <br />
        <input
          type="date"
          id="formulario-fecha-evaluacion"
          aria-label="Fecha de evaluación"
          value={datosExamen.fechaEvaluacion}
          onChange={(e) => {
            setDatosExamen({
              ...datosExamen,
              fechaEvaluacion: e.target.value,
            })
          }}
        />
      </div>

      <div>
        <label htmlFor="formulario-porcentaje-evaluacion">Porcentaje de examen</label>
        <br />
        <input
          type="text"
          id="formulario-porcentaje-evaluacion"
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

      {esEditar ? (
        <button
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
        onClick={() => {
          setCursoCrearExamenSeleccionado(null)
          setEditarExamenCursoSeleccionada(null)
        }}
      >
        Cancelar
      </button>
    </>
  )
}

export default FormularioEvaluacion
