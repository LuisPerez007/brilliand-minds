import api from '../api/api.js'

export const getEstudiantes = async () => await api.get(`/admin/estudiantes`)

export const postEstudiantes = async (data) => await api.post('/admin/estudiantes', data)

export const putEstudiantes = async (id, data) => await api.put(`/admin/estudiantes/${id}`, data)

export const deleteEstudiantes = (id) => api.delete(`/admin/estudiantes/${id}`)
