import PropTypes from 'prop-types'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

const SectionCard = ({ title, description, actions, children, className = '' }) => {
  return (
    <CCard className={`bm-section-card ${className}`.trim()}>
      {(title || description || actions) && (
        <CCardHeader className="bm-section-card-header">
          <div>
            {title && <h2 className="bm-section-card-title">{title}</h2>}
            {description && <p className="bm-section-card-description">{description}</p>}
          </div>
          {actions && <div className="bm-section-card-actions">{actions}</div>}
        </CCardHeader>
      )}
      <CCardBody>{children}</CCardBody>
    </CCard>
  )
}

SectionCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  actions: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

export default SectionCard
