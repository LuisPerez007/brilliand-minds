import publicApi from '../api/publicApi'
import api from '../api/api'

export const postPreinscripcionEstudiante = async (data) =>
  await publicApi.post('/preinscripcion/estudiante', data)

export const getPreinscripcionEstudiante = async () => await api.get('/admin/preinscripcion/lista')

export const postPreinscripcionRechazado = async (idSolicitud) =>
  await api.post(`/admin/preinscripcion/rechazado/${idSolicitud}`)

export const postPreinscripcionAceptada = async (idSolicitud) =>
  await api.post(`/admin/preinscripcion/aceptada/${idSolicitud}`)
