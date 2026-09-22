import PropTypes from 'prop-types'
import { CBadge } from '@coreui/react'

const statusColors = {
  activo: 'success',
  aprobado: 'success',
  pagado: 'success',
  pendiente: 'warning',
  rechazado: 'danger',
  vencido: 'danger',
  inactivo: 'secondary',
}

const StatusBadge = ({ status, children }) => {
  const label = children || status
  const color = statusColors[String(status).toLowerCase()] || 'secondary'

  return <CBadge color={color}>{label}</CBadge>
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  children: PropTypes.node,
}

export default StatusBadge
