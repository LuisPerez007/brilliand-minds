import PropTypes from 'prop-types'
import { CCardBody, CSpinner } from '@coreui/react'

const LoadingState = ({ label = 'Cargando...' }) => {
  return (
    <CCardBody className="bm-loading-state" role="status" aria-live="polite">
      <CSpinner color="primary" size="sm" />
      <span>{label}</span>
    </CCardBody>
  )
}

LoadingState.propTypes = {
  label: PropTypes.string,
}

export default LoadingState
