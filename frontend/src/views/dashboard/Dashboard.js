import { useEffect, useState } from 'react'
import { CAlert, CCol, CRow, CSpinner, CWidgetStatsA } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBook, cilCash, cilPeople, cilTask } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { getCursosPorVencer } from '../../services/cursosService'
import { getEstudiantes } from '../../services/estudiantesService'
import { getPreinscripcionEstudiante } from '../../services/preInscripcionEstudianteRoutes'
import { getControlDePagosParaLosEstudiante } from '../../services/controlPagosParaEstudiantes'
import {
  getCursosEvaluacionProfesor,
  getCursosProfesor,
  getEstudiantesProfesor,
} from '../../services/gestionProfesor/gestionprofesCursos'
import { getMostrarCursosEstudiante } from '../../services/gestionEstudiante/cursosEstudiante'
import { obtenerRol } from '../utils/usuario'

const mockMetricas = {
  administrador: {
    ingresos: 'Bs. 12.450',
  },
  profesor: {
    asistencia: '92%',
  },
  estudiante: {
    promedio: '85/100',
    examenes: '2 próximos',
    cuenta: 'Al día',
  },
}

const Dashboard = () => {
  const rol = obtenerRol()
  const navigate = useNavigate()
  const [metricas, setMetricas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [cursosPorVencer, setCursosPorVencer] = useState([])

  const rutasPorRol = {
    administrador: {
      'Total Estudiantes': '/admin/estudiantes',
      'Ingresos del Mes': '/admin/recibos',
      'Preinscripciones Pendientes': '/admin/preinscripciones',
      'Pagos Vencidos': '/admin/control-pagos',
    },
    profesor: {
      'Mis Cursos Asignados': '/docente/cursos',
      'Total Alumnos a Cargo': '/docente/estudiantes',
      'Evaluaciones Pendientes de Calificar': '/docente/evaluaciones',
      'Promedio de Asistencia': '/docente/estudiantes',
    },
    estudiante: {
      'Mis Cursos': '/estudiante/cursos',
      'Mi Promedio General': '/estudiante/cursos',
      'Próximos Exámenes': '/estudiante/cursos',
      'Estado de Cuenta': '/estudiante/cursos',
    },
  }

  useEffect(() => {
    let componenteActivo = true

    const cargarMetricas = async () => {
      setCargando(true)

      try {
        let metricasPorRol = []

        if (rol === 'administrador') {
          const [estudiantes, preinscripciones, pagos] = await Promise.all([
            getEstudiantes(),
            getPreinscripcionEstudiante(),
            getControlDePagosParaLosEstudiante(),
          ])

          metricasPorRol = [
            { color: 'primary', title: 'Total Estudiantes', value: estudiantes.data.length },
            {
              color: 'info',
              title: 'Ingresos del Mes',
              value: mockMetricas.administrador.ingresos,
            },
            {
              color: 'warning',
              title: 'Preinscripciones Pendientes',
              value: preinscripciones.data.length,
            },
            { color: 'danger', title: 'Pagos Vencidos', value: pagos.data.length },
          ]
        } else if (rol === 'profesor') {
          const [cursos, estudiantes, evaluaciones] = await Promise.all([
            getCursosProfesor(),
            getEstudiantesProfesor(),
            getCursosEvaluacionProfesor(),
          ])

          metricasPorRol = [
            { color: 'primary', title: 'Mis Cursos Asignados', value: cursos.data.length },
            { color: 'info', title: 'Total Alumnos a Cargo', value: estudiantes.data.length },
            {
              color: 'warning',
              title: 'Evaluaciones Pendientes de Calificar',
              value: evaluaciones.data.length,
            },
            {
              color: 'danger',
              title: 'Promedio de Asistencia',
              value: mockMetricas.profesor.asistencia,
            },
          ]
        } else if (rol === 'estudiante') {
          const cursos = await getMostrarCursosEstudiante()

          metricasPorRol = [
            { color: 'primary', title: 'Mis Cursos', value: cursos.data.length },
            {
              color: 'info',
              title: 'Mi Promedio General',
              value: mockMetricas.estudiante.promedio,
            },
            {
              color: 'warning',
              title: 'Próximos Exámenes',
              value: mockMetricas.estudiante.examenes,
            },
            { color: 'danger', title: 'Estado de Cuenta', value: mockMetricas.estudiante.cuenta },
          ]
        }

        if (componenteActivo) {
          setMetricas(metricasPorRol)
        }
      } catch (error) {
        console.error('Error al cargar métricas académicas', error)
      } finally {
        if (componenteActivo) {
          setCargando(false)
        }
      }
    }

    cargarMetricas()

    return () => {
      componenteActivo = false
    }
  }, [rol])

  useEffect(() => {
    if (rol !== 'administrador') return

    let componenteActivo = true

    const cargarCursosPorVencer = async () => {
      try {
        const respuesta = await getCursosPorVencer()
        const cursos = respuesta?.data?.cursosPorVencer ?? []

        if (componenteActivo) {
          setCursosPorVencer(cursos)
        }
      } catch (error) {
        console.error('Error al cargar cursos por vencer', error)
        if (componenteActivo) {
          setCursosPorVencer([])
        }
      }
    }

    cargarCursosPorVencer()

    return () => {
      componenteActivo = false
    }
  }, [rol])

  if (cargando) {
    return <CSpinner color="primary" />
  }

  return (
    <>
      {rol === 'administrador' && cursosPorVencer.length > 0 && (
        <div className="dashboard-alerts__section">
          <div className="dashboard-alerts__header">
            <h6 className="dashboard-alerts__title">Cursos próximos a vencer</h6>
          </div>

          <div className="dashboard-alerts__list">
            {cursosPorVencer.map((curso) => (
              <CAlert key={curso.id_curso} color="warning" className="dashboard-alert__item">
                <div className="dashboard-alert__content">
                  <strong className="text-body">{curso.nombre}</strong>
                  <span>Vence en {curso.dias_restantes ?? 0} día(s)</span>
                </div>
                <small>{new Date(curso.fecha_fin).toLocaleDateString()}</small>
              </CAlert>
            ))}
          </div>
        </div>
      )}
      <br />
      <CRow className="mb-4" xs={{ gutter: 4 }}>
        {metricas.map((metrica, index) => {
          const ruta = rutasPorRol[rol]?.[metrica.title]

          return (
            <CCol key={metrica.title} sm={6} xl={4} xxl={3}>
              <CWidgetStatsA
                color={metrica.color}
                value={
                  <>
                    {metrica.value} <CIcon icon={[cilPeople, cilCash, cilTask, cilBook][index]} />
                  </>
                }
                title={metrica.title}
                onClick={() => {
                  if (ruta) navigate(ruta)
                }}
                className={ruta ? 'dashboard-metric__card--clickable' : ''}
              />
            </CCol>
          )
        })}
      </CRow>
    </>
  )
}

export default Dashboard
