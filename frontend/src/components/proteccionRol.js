import { Navigate } from 'react-router-dom'
import { obtenerRutaPrincipal, obtenerUsuario } from '../views/utils/usuario'

const ProteccionRol = ({ children, rolesPermitidos }) => {
  const usuario = obtenerUsuario()
  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (!rolesPermitidos.includes(usuario.role)) {
    return <Navigate to={obtenerRutaPrincipal() || '/login'} replace />
  }

  return children
}

export default ProteccionRol
