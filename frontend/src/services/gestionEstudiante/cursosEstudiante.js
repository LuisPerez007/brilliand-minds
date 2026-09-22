import apiEstudiante from '../../api/apiEstudiante'

export const getMostrarCursosEstudiante = () => apiEstudiante.get('/cursos')
export const getMostrarCalificaionesDeunCursoEstudiante = (data) =>
  apiEstudiante.get(`/curso/calificaciones/${data}`)

export const getMostrarCursosNoInscritosDeunEstudiante = () =>
  apiEstudiante.get(`/curso/no-inscritos`)

export const crearInscripcionAunCursoEstudiante = (idCurso) =>
  apiEstudiante.post(`/curso/inscripcion-a-un-curso/${idCurso}`)

export const getMostrarDeudasEstudiante = () => apiEstudiante.get(`/curso/deudas`)
