import api from '../api/api'

export const getControlDePagosParaLosEstudiante = async () =>
  await api.get('/admin/inscripciones/control-pagos')

export const putMarcarInscripcionPagada = async (idInscripcion) =>
  await api.put(`/admin/inscripciones/marcar-pagado/${idInscripcion}`)

export const getMostrarRecibos = async () => await api.get('/admin/inscripciones/mostrar-recibos')

export const postRegistrarRecibos = async (reciboData) =>
  await api.post('/admin/inscripciones/registrar-recibos', reciboData)
