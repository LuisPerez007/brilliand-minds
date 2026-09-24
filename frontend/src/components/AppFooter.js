import React from 'react'

const AppFooter = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <div className="container-fluid app-footer__inner d-flex justify-content-between align-items-center flex-column flex-md-row px-4">
        <div className="app-footer__brand">
          <span>&copy; {year} Brilliant Minds</span>
        </div>
        <div className="app-footer__meta">
          <span>Sistema de Gestión Académica • v1.0</span>
        </div>
      </div>
    </footer>
  )
}

export default React.memo(AppFooter)
