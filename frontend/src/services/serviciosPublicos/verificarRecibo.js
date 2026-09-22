import publicApi from '../../api/publicApi'

export const verificarRecibo = async (token) =>
  await publicApi.get(`/public/verificar-recibo/${token}`)
