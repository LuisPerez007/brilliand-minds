import api from '../../api/api'

export const putHabilitarUsuario = async (idUsuario) =>
  api.put(`/admin/habilitar-usuario/${idUsuario}`)
