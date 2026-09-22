import api from '../api/api'

export const getCursos = async () => await api.get('/admin/cursos')

export const postCursos = async (data) => await api.post('/admin/cursos', data)

export const putCursos = async (id, data) => await api.put(`/admin/cursos/${id}`, data)

export const deleteCursos = async (id) => await api.delete(`/admin/cursos/${id}`)
