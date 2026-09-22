import apiDocente from '../../api/apiDocente'

export const getCursosProfesor = () => apiDocente.get(`/cursos`)
export const getEstudiantesProfesor = () => apiDocente.get(`/estudiantes`)
export const getCursosEvaluacionProfesor = () => apiDocente.get(`/cursos/evaluacion`)
export const getEvaluacionCursoProfesor = (idCurso) =>
  apiDocente.get(`/cursos/evaluacion/examen/${idCurso}`)

export const postCrearEvaluacionAunCursoProfesor = (datos) =>
  apiDocente.post(`/cursos/evaluacion/examen/crearEvaluacion`, datos)
export const putEditarEvaluacionAunCursoProfesor = (datos) =>
  apiDocente.put(`/cursos/evaluacion/examen/editarEvaluacion`, datos)
export const deleteEvaluacionDeunCursoProfesor = (idEvaluacion) =>
  apiDocente.delete(`/cursos/evaluacion/examen/eliminarEvaluacion/${idEvaluacion}`)

export const listarCalificacionesEvaluacion = (idCurso, idEvaluacion) =>
  apiDocente.get(`/cursos/evaluacion/examen/listarCalificaciones/${idCurso}/${idEvaluacion}`)
export const postCalificarExamenEstudiante = (datos) =>
  apiDocente.post(`/cursos/evaluacion/examen/listarCalificaciones/calificarExamen`, datos)
export const putCalificarExamenEstudiante = (datos) =>
  apiDocente.put(`/cursos/evaluacion/examen/listarCalificaciones/editarExamen`, datos)
