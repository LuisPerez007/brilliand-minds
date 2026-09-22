import api from '../api/api'

export const getMostrandoPadresTutores = async () => await api.get('/admin/padres-tutores')
export const postRegistroPadreTutor = async (data) =>
  await api.post('/admin/padres-tutores/registro', data)
export const putActualizarPadreTutor = async (id, data) =>
  await api.put(`/admin/padres-tutores/actualizar/${id}`, data)
export const deleteEliminarPadreTutor = async (id) =>
  await api.delete(`/admin/padres-tutores/eliminar/${id}`)
