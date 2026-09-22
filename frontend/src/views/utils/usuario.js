import { jwtDecode } from 'jwt-decode'
import { getAccessToken, clearAccessToken } from '../../services/authSession'

export const obtenerUsuario = () => {
  const token = getAccessToken()
  if (!token) {
    return null
  }
  try {
    return jwtDecode(token)
  } catch {
    clearAccessToken()
    return null
  }
}

export const obtenerRol = () => obtenerUsuario()?.role || null

export const obtenerRutaPrincipal = () => {
  const rutasPorRol = {
    administrador: '/admin/estudiantes',
    profesor: '/docente/cursos',
    estudiante: '/estudiante/preinscripciones',
  }

  return rutasPorRol[obtenerRol()] || null
}
