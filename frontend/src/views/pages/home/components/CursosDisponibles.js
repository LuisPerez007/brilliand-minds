import { cilPeople } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
  CSpinner,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import respaldoCursos from '../../../../assets/images/respaldoCursosWeb.jpg'

const CursosDisponibles = ({ cursos, loading, error }) => {
  const navigate = useNavigate()

  if (error) return <CAlert color="danger">{error}</CAlert>
  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <CSpinner color="primary" />
      </div>
    )
  }
  if (cursos.length === 0) {
    return <CAlert color="info">No hay cursos disponibles en este momento.</CAlert>
  }

  return (
    <CRow className="g-4">
      {cursos.map((curso) => {
        const unidad =
          curso.duracion && typeof curso.duracion === 'object'
            ? Object.keys(curso.duracion)[0]
            : null
        const valor = unidad ? curso.duracion[unidad] : null
        const unidades = {
          days: 'días',
          hours: 'horas',
          months: 'meses',
          weeks: 'semanas',
        }

        return (
          <CCol key={curso.id_curso} sm={6} lg={3}>
            <CCard className="h-100 shadow-sm border-0">
              <div className="position-relative">
                <CCardImage
                  component="img"
                  orientation="top"
                  src={curso.imagen || respaldoCursos}
                  alt={`Curso de ${curso.materia}`}
                  className="object-fit-cover"
                  height={180}
                />
                {curso.autorImagen && (
                  <div
                    className="position-absolute bottom-0 start-0 px-2 py-1 small"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.55)',
                      color: 'white',
                    }}
                  >
                    Foto de{' '}
                    <a
                      href={curso.autorImagenUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-decoration-underline"
                    >
                      {curso.autorImagen}
                    </a>{' '}
                    en{' '}
                    <a
                      href={curso.unsplashUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-decoration-underline"
                    >
                      Unsplash
                    </a>
                  </div>
                )}
              </div>
              <CCardBody className="d-flex flex-column">
                <CCardTitle>{curso.materia}</CCardTitle>
                <CCardText className="text-body-secondary flex-grow-1">
                  {curso.descripcion || 'Curso specialized para impulsar tus habilidades.'}
                </CCardText>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <CBadge color="info">
                    {unidad && valor
                      ? `${valor} ${unidades[unidad] || unidad}`
                      : 'Duración por confirmar'}
                  </CBadge>
                  <CBadge color="secondary">
                    <CIcon icon={cilPeople} className="me-1" />
                    {curso.cupo_total ?? '---'} cupos
                  </CBadge>
                  <CBadge color="success">Bs. {curso.costo ?? 'Por confirmar'}</CBadge>
                </div>
                <CButton color="primary" className="mt-auto" onClick={() => navigate('/register')}>
                  Preinscribirse
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        )
      })}
    </CRow>
  )
}

export default CursosDisponibles
