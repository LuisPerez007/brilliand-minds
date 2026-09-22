import { Navigate } from 'react-router-dom'
import { obtenerUsuario } from '../views/utils/usuario'

const ProteccionRoute = ({ children }) => {
  if (!obtenerUsuario()) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProteccionRoute
