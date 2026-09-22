import CIcon from '@coreui/icons-react'
import { cilUser } from '@coreui/icons'
import { CButton, CContainer, CHeader, CHeaderBrand, CHeaderNav, CNavLink } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import CursosDisponibles from './components/CursosDisponibles'
import { useCursosDisponibles } from './hooks/useCursosDisponibles'

const Home = () => {
  const navigate = useNavigate()
  const { cursos, loading, error } = useCursosDisponibles()

  return (
    <div className="bg-body-tertiary min-vh-100">
      <CHeader className="border-bottom bg-body px-3 px-md-5">
        <CContainer fluid>
          <CHeaderBrand className="fw-bold fs-4 text-primary">Brilliant Minds</CHeaderBrand>
          <CHeaderNav className="ms-auto">
            <CNavLink
              as="button"
              type="button"
              className="text-primary d-flex align-items-center gap-2 fw-semibold border-0 bg-transparent"
              onClick={() => navigate('/login')}
            >
              <CIcon icon={cilUser} />
              Iniciar Sesión
            </CNavLink>
          </CHeaderNav>
        </CContainer>
      </CHeader>

      <main>
        <section className="bg-primary text-white py-5">
          <CContainer className="py-5 text-center">
            <p className="text-uppercase fw-semibold mb-3">Aprender transforma</p>
            <h1 className="display-4 fw-bold mx-auto" style={{ maxWidth: '900px' }}>
              Brilliant Minds: Impulsa tu futuro con nuestros cursos especializados
            </h1>
            <p className="lead mx-auto my-4" style={{ maxWidth: '720px' }}>
              Desarrolla tus habilidades, descubre nuevas pasiones y prepárate para los desafíos del
              futuro con docentes que creen en tu potencial.
            </p>
            <CButton color="light" size="lg" onClick={() => navigate('/register')}>
              Preinscribirse Ahora
            </CButton>
          </CContainer>
        </section>

        <section className="py-5">
          <CContainer>
            <div className="mb-4">
              <p className="text-primary fw-semibold mb-2">Nuestros cursos</p>
              <h2 className="fw-bold">Aprendizaje que abre nuevas posibilidades</h2>
              <p className="text-body-secondary mb-0">
                Elige una experiencia formativa y comienza tu camino en Brilliant Minds.
              </p>
            </div>
            <CursosDisponibles cursos={cursos} loading={loading} error={error} />
          </CContainer>
        </section>
      </main>
    </div>
  )
}

export default Home
