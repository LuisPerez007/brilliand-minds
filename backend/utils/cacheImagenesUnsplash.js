const cache = new Map()
const solicitudesEnCurso = new Map()

const DURACION_CACHE = 60 * 60 * 1000 // 1 hora

export const obtenerDeCache = (clave) => {
  const elemento = cache.get(clave)

  if (!elemento) {
    return null
  }

  const haExpirado = Date.now() - elemento.timestamp > DURACION_CACHE

  if (haExpirado) {
    cache.delete(clave)
    return null
  }

  return elemento.data
}

export const guardarEnCache = (clave, data) => {
  cache.set(clave, {
    data,
    timestamp: Date.now()
  })
}

export const obtenerSolicitudEnCurso = (clave) => {
  return solicitudesEnCurso.get(clave)
}

export const guardarSolicitudEnCurso = (clave, promesa) => {
  solicitudesEnCurso.set(clave, promesa)
}

export const eliminarSolicitudEnCurso = (clave) => {
  solicitudesEnCurso.delete(clave)
}
