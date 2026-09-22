import { useCursosEvaluacionProfesor } from './hooks/useCursosEvaluacionProfesor'
import TableCursosEvaluacionProfesor from './components/TableCursosEvaluacionProfesor'

const ObtenerCursosEvaluacionProfesor = () => {
  const {
    listaCalificacion,
    cargandoCalificaciones,
    setListaCalificacion,
    cargarListaCalificaciones,
    cursoEvaluacionProfesor,
    evaluacionesCurso,
    mostrarEvaluacionesDeunCurso,
    cursoSeleccionado,
    setCursoSeleccionado,
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
  } = useCursosEvaluacionProfesor()
  return (
    <>
      <TableCursosEvaluacionProfesor
        cursoEvaluacionProfesor={cursoEvaluacionProfesor}
        mostrarEvaluacionesDeunCurso={mostrarEvaluacionesDeunCurso}
        evaluacionesCurso={evaluacionesCurso}
        cursoSeleccionado={cursoSeleccionado}
        setCursoSeleccionado={setCursoSeleccionado}
        listaCalificacion={listaCalificacion}
        cargandoCalificaciones={cargandoCalificaciones}
        cargarListaCalificaciones={cargarListaCalificaciones}
        evaluacionSeleccionada={evaluacionSeleccionada}
        setEvaluacionSeleccionada={setEvaluacionSeleccionada}
        registrarCalificacion={registrarCalificacion}
        setListaCalificacion={setListaCalificacion}
        editarCalificacion={editarCalificacion}
        calificacionEditando={calificacionEditando}
        setCalificacionEditando={setCalificacionEditando}
        cursoCrearExamenSelecionado={cursoCrearExamenSelecionado}
        setCursoCrearExamenSeleccionado={setCursoCrearExamenSeleccionado}
        crearEvaluacionDeunCurso={crearEvaluacionDeunCurso}
        datosExamen={datosExamen}
        setDatosExamen={setDatosExamen}
        editarExamenCursoSeleccionada={editarExamenCursoSeleccionada}
        setEditarExamenCursoSeleccionada={setEditarExamenCursoSeleccionada}
        editarEvaluacionDeunCurso={editarEvaluacionDeunCurso}
        eliminarEvaluacionDeunCurso={eliminarEvaluacionDeunCurso}
      />
    </>
  )
}

export default ObtenerCursosEvaluacionProfesor
