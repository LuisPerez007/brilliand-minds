import publicApi from '../../api/publicApi'

export const obtenerCursosDisponibles = async () =>
  await publicApi.get('/public/cursos-disponibles')
