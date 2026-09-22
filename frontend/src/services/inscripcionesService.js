import api from '../api/api'

export const getInscripciones = async () => await api.get('/admin/inscripciones')
export const getInscripcionesPorCurso = (id) => api.get(`/admin/inscripciones/curso/${id}`)
export const getInscripcionesPorProfesor = (id) => api.get(`/admin/inscripciones/profesor/${id}`)

export const postInscripciones = async (data) => await api.post('/admin/inscripciones', data)
export const mostrarInscripcionPorEstudiante = async (id) =>
  await api.get(`/admin/inscripciones/estudiante/${id}`)

export const deleteInscripcionPorId = async (id) => await api.delete(`/admin/inscripciones/${id}`)
export const deleteinscripcionPorEstudiante = async (id) =>
  await api.delete(`/admin/inscripciones/${id}/estudiante`)
export const deleteEliminarTodasInscripcionesDelCurso = async (idCurso) =>
  await api.delete(`/admin/inscripciones/eliminar-por-curso/${idCurso}`)
