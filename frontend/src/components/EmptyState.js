import PropTypes from 'prop-types'
import { CButton, CCardBody } from '@coreui/react'

const EmptyState = ({ title, description, actionLabel, onAction }) => {
  return (
    <CCardBody className="bm-empty-state">
      <div className="bm-empty-state-icon" aria-hidden="true">
        -
      </div>
      <h2 className="bm-empty-state-title">{title}</h2>
      {description && <p className="bm-empty-state-description">{description}</p>}
      {actionLabel && onAction && (
        <CButton color="primary" onClick={onAction}>
          {actionLabel}
        </CButton>
      )}
    </CCardBody>
  )
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
}

export default EmptyState
