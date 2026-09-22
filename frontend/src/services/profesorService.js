import api from '../api/api'

export const getProfesor = async () => await api.get('/admin/profesor')
export const postProfesor = async (data) => await api.post('/admin/profesor', data)
export const putProfesor = async (id, data) => await api.put(`/admin/profesor/${id}`, data)
export const deleteProfesor = async (id) => await api.delete(`/admin/profesor/${id}`)
