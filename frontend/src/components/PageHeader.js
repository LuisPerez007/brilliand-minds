import PropTypes from 'prop-types'

const PageHeader = ({ eyebrow, title, description, actions }) => {
  return (
    <div className="bm-page-header">
      <div>
        {eyebrow && <div className="bm-page-header-eyebrow">{eyebrow}</div>}
        <h1 className="bm-page-header-title">{title}</h1>
        {description && <p className="bm-page-header-description">{description}</p>}
      </div>
      {actions && <div className="bm-page-header-actions">{actions}</div>}
    </div>
  )
}

PageHeader.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actions: PropTypes.node,
}

export default PageHeader
