import CIcon from '@coreui/icons-react'
import { cilUser } from '@coreui/icons'
import { CButton, CContainer, CHeader, CHeaderBrand, CHeaderNav, CNavLink } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import robotTech from '../../../assets/images/robot-tech-3d.png'
import CursosDisponibles from './components/CursosDisponibles'
import { useCursosDisponibles } from './hooks/useCursosDisponibles'

const Home = () => {
  const navigate = useNavigate()
  const { cursos, loading, error } = useCursosDisponibles()

  return (
    <div className="home-page" data-coreui-theme="light">
      <CHeader
        className="home-header"
        style={{ backgroundColor: '#ffffff', borderColor: '#d8dbe0' }}
      >
        <CContainer fluid className="home-header__container">
          <CHeaderBrand className="home-brand" href="#">
            <span className="home-brand__mark">BM</span>
            <span className="home-brand__text">Brilliant Minds</span>
          </CHeaderBrand>
          <CHeaderNav className="ms-auto">
            <CNavLink
              as="button"
              type="button"
              className="home-login"
              onClick={() => navigate('/login')}
            >
              <span className="home-login__icon">
                <CIcon icon={cilUser} />
              </span>
              Iniciar Sesión
            </CNavLink>
          </CHeaderNav>
        </CContainer>
      </CHeader>

      <main className="home-main">
        <section className="home-hero">
          <CContainer className="home-hero__container">
            <div className="home-hero__grid">
              <div className="home-hero__content">
                <p className="home-hero__eyebrow">Aprender transforma</p>
                <h1 className="home-hero__title">
                  Brilliant Minds: Impulsa tu futuro con nuestros cursos especializados
                </h1>
                <p className="home-hero__copy">
                  Desarrolla tus habilidades, descubre nuevas pasiones y prepárate para los desafíos
                  del futuro con docentes que creen en tu potencial.
                </p>
                <div className="home-hero__actions">
                  <CButton
                    className="home-cta home-cta--primary"
                    size="lg"
                    onClick={() => navigate('/register')}
                  >
                    Preinscribirse Ahora
                  </CButton>
                </div>
              </div>

              <div className="home-hero__visual">
                <div className="home-robot-stage">
                  <span className="home-robot-badge home-robot-badge--top">Future Skills</span>
                  <span className="home-robot-badge home-robot-badge--bottom">
                    Mentoría + innovación
                  </span>
                  <img src={robotTech} alt="Robot tecnológico 3D" className="home-robot__image" />
                </div>
              </div>
            </div>
          </CContainer>
        </section>

        <section className="home-courses">
          <CContainer className="home-courses__container">
            <div className="home-courses__header">
              <p className="home-courses__eyebrow">Nuestros cursos</p>
              <h2 className="home-courses__title">Aprendizaje que abre nuevas posibilidades</h2>
              <p className="home-courses__copy">
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
